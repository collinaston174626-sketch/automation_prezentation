"""
Universal Apple-style auto-play fade animations for PPTX presentations.
Reads animation groups from a sidecar JSON config file.

Critical animation rules:
1. <p:set style.visibility=visible> is MANDATORY before each fade
2. First animation = clickEffect (auto-starts on slide enter)
3. All others = withEffect with delay-based timing
4. Light theme transitions: thruBlk=0 (no black flash)

Dependencies: pip install defusedxml
Usage: python add-animations.py <presentation.pptx> [animation-config.json]
       If config not specified, looks for <name>_animation-config.json
"""
import os
import sys
import json
import shutil
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

P = 'http://schemas.openxmlformats.org/presentationml/2006/main'
A = 'http://schemas.openxmlformats.org/drawingml/2006/main'
R = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships'

ET.register_namespace('', P)
ET.register_namespace('a', A)
ET.register_namespace('r', R)


def make_fade_anim(parent, spid, delay_ms, dur_ms, tn_id, is_first):
    """Create a PowerPoint fade entrance animation for one shape.
    Returns next available tn_id."""
    tid = tn_id

    par = ET.SubElement(parent, f'{{{P}}}par')
    ctn = ET.SubElement(par, f'{{{P}}}cTn')
    ctn.set('id', str(tid)); tid += 1
    ctn.set('presetID', '10')       # Fade
    ctn.set('presetClass', 'entr')   # Entrance
    ctn.set('presetSubtype', '0')
    ctn.set('fill', 'hold')
    ctn.set('grpId', '0')
    ctn.set('nodeType', 'clickEffect' if is_first else 'withEffect')

    st = ET.SubElement(ctn, f'{{{P}}}stCondLst')
    ET.SubElement(st, f'{{{P}}}cond').set('delay', str(delay_ms))

    child = ET.SubElement(ctn, f'{{{P}}}childTnLst')

    # 1) <p:set> visibility to "visible" - CRITICAL for hiding element initially
    p_set = ET.SubElement(child, f'{{{P}}}set')
    set_bhvr = ET.SubElement(p_set, f'{{{P}}}cBhvr')
    set_ctn = ET.SubElement(set_bhvr, f'{{{P}}}cTn')
    set_ctn.set('id', str(tid)); tid += 1
    set_ctn.set('dur', '1')
    set_ctn.set('fill', 'hold')
    set_st = ET.SubElement(set_ctn, f'{{{P}}}stCondLst')
    ET.SubElement(set_st, f'{{{P}}}cond').set('delay', '0')
    set_tgt = ET.SubElement(set_bhvr, f'{{{P}}}tgtEl')
    ET.SubElement(set_tgt, f'{{{P}}}spTgt').set('spid', str(spid))
    set_attr = ET.SubElement(set_bhvr, f'{{{P}}}attrNameLst')
    ET.SubElement(set_attr, f'{{{P}}}attrName').text = 'style.visibility'
    set_to = ET.SubElement(p_set, f'{{{P}}}to')
    ET.SubElement(set_to, f'{{{P}}}strVal').set('val', 'visible')

    # 2) <p:animEffect> fade in
    anim_eff = ET.SubElement(child, f'{{{P}}}animEffect')
    anim_eff.set('transition', 'in')
    anim_eff.set('filter', 'fade')
    eff_bhvr = ET.SubElement(anim_eff, f'{{{P}}}cBhvr')
    eff_ctn = ET.SubElement(eff_bhvr, f'{{{P}}}cTn')
    eff_ctn.set('id', str(tid)); tid += 1
    eff_ctn.set('dur', str(dur_ms))
    eff_tgt = ET.SubElement(eff_bhvr, f'{{{P}}}tgtEl')
    ET.SubElement(eff_tgt, f'{{{P}}}spTgt').set('spid', str(spid))

    return tid


def build_timing(config):
    """Build complete timing XML for a slide."""
    groups = config['groups']
    delays = config['delays']
    dur = config['dur']

    timing = ET.Element(f'{{{P}}}timing')
    tn_lst = ET.SubElement(timing, f'{{{P}}}tnLst')

    root_par = ET.SubElement(tn_lst, f'{{{P}}}par')
    root_ctn = ET.SubElement(root_par, f'{{{P}}}cTn')
    root_ctn.set('id', '1')
    root_ctn.set('dur', 'indefinite')
    root_ctn.set('restart', 'never')
    root_ctn.set('nodeType', 'tmRoot')
    root_child = ET.SubElement(root_ctn, f'{{{P}}}childTnLst')

    seq = ET.SubElement(root_child, f'{{{P}}}seq')
    seq.set('concurrent', '1')
    seq.set('nextAc', 'seek')
    seq_ctn = ET.SubElement(seq, f'{{{P}}}cTn')
    seq_ctn.set('id', '2')
    seq_ctn.set('dur', 'indefinite')
    seq_ctn.set('nodeType', 'mainSeq')
    seq_child = ET.SubElement(seq_ctn, f'{{{P}}}childTnLst')

    click_par = ET.SubElement(seq_child, f'{{{P}}}par')
    click_ctn = ET.SubElement(click_par, f'{{{P}}}cTn')
    click_ctn.set('id', '3')
    click_ctn.set('fill', 'hold')
    click_st = ET.SubElement(click_ctn, f'{{{P}}}stCondLst')
    ET.SubElement(click_st, f'{{{P}}}cond').set('delay', '0')
    click_child = ET.SubElement(click_ctn, f'{{{P}}}childTnLst')

    tid = 4
    is_first = True

    for gi, group in enumerate(groups):
        group_delay = delays[gi] if gi < len(delays) else delays[-1] + (gi - len(delays) + 1) * 400
        for si, spid in enumerate(group):
            elem_delay = group_delay + si * 20  # micro-stagger
            tid = make_fade_anim(click_child, spid, elem_delay, dur, tid, is_first)
            is_first = False

    for tag_name, evt in [('prevCondLst', 'onPrev'), ('nextCondLst', 'onNext')]:
        cl = ET.SubElement(seq, f'{{{P}}}{tag_name}')
        c = ET.SubElement(cl, f'{{{P}}}cond')
        c.set('evt', evt)
        c.set('delay', '0')
        t = ET.SubElement(c, f'{{{P}}}tgtEl')
        ET.SubElement(t, f'{{{P}}}sldTgt')

    return timing


def add_transition(root):
    """Add smooth fade slide transition (light theme: no black)."""
    for elem in list(root):
        if elem.tag.endswith('}transition'):
            root.remove(elem)
    tr = ET.SubElement(root, f'{{{P}}}transition')
    tr.set('spd', 'med')
    tr.set('advClick', '1')
    fade = ET.SubElement(tr, f'{{{P}}}fade')
    fade.set('thruBlk', '0')


def process_slide(slides_dir, num, slide_config):
    fp = os.path.join(slides_dir, f'slide{num}.xml')
    if not os.path.exists(fp):
        return

    tree = ET.parse(fp)
    root = tree.getroot()

    for elem in list(root):
        if elem.tag.endswith('}timing'):
            root.remove(elem)

    add_transition(root)

    if slide_config:
        timing = build_timing(slide_config)
        root.append(timing)
        total = sum(len(g) for g in slide_config['groups'])
        print(f'Slide {num}: {len(slide_config["groups"])} groups, {total} shapes, dur={slide_config["dur"]}ms')

    tree.write(fp, xml_declaration=True, encoding='UTF-8')


def unpack_pptx(pptx_path, output_dir):
    Path(output_dir).mkdir(parents=True, exist_ok=True)
    zipfile.ZipFile(pptx_path).extractall(output_dir)
    print(f'Unpacked: {pptx_path} -> {output_dir}')


def pack_pptx(input_dir, output_path):
    Path(output_path).parent.mkdir(parents=True, exist_ok=True)
    with zipfile.ZipFile(output_path, 'w', zipfile.ZIP_DEFLATED) as zf:
        input_path = Path(input_dir)
        for f in input_path.rglob('*'):
            if f.is_file():
                zf.write(f, f.relative_to(input_path))
    print(f'Packed: {input_dir} -> {output_path}')


def main():
    if len(sys.argv) < 2:
        print('Usage: python add-animations.py <presentation.pptx> [animation-config.json]')
        sys.exit(1)

    pptx_path = sys.argv[1]
    if not os.path.exists(pptx_path):
        print(f'Error: {pptx_path} not found')
        sys.exit(1)

    # Find animation config
    if len(sys.argv) > 2:
        config_path = sys.argv[2]
    else:
        # Auto-detect: <name>_animation-config.json
        base = os.path.splitext(pptx_path)[0]
        config_path = base + '_animation-config.json'

    if not os.path.exists(config_path):
        print(f'Error: Animation config not found: {config_path}')
        sys.exit(1)

    with open(config_path, 'r', encoding='utf-8') as f:
        slide_groups = {int(k): v for k, v in json.load(f).items()}

    print(f'Loaded animation config: {len(slide_groups)} slides')

    work_dir = os.path.join(os.path.dirname(pptx_path), '_unpacked_temp')
    if os.path.exists(work_dir):
        shutil.rmtree(work_dir)

    try:
        unpack_pptx(pptx_path, work_dir)

        slides_dir = os.path.join(work_dir, 'ppt', 'slides')
        max_slide = max(slide_groups.keys())
        for i in range(1, max_slide + 1):
            process_slide(slides_dir, i, slide_groups.get(i))

        backup = pptx_path + '.bak'
        shutil.copy2(pptx_path, backup)
        pack_pptx(work_dir, pptx_path)
        print(f'\nDone! Animations applied to {pptx_path}')
        print(f'Backup saved: {backup}')
    finally:
        if os.path.exists(work_dir):
            shutil.rmtree(work_dir)


if __name__ == '__main__':
    main()
