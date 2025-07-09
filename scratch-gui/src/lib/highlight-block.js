// scratch-gui/src/lib/highlight-block.js
/**
 * 指定されたIDを持つ Blockly ブロックを強調表示します。
 * @param {Blockly.WorkspaceSvg} workspace - 対象のワークスペース。
 * @param {string} blockId - 強調表示するブロックのID。
 * @param {boolean} highlight - 強調表示を適用するか解除するか。
 * @param {string} [className='tutorial-highlight'] - 適用するCSSクラス名。
 */
const highlightBlock = (workspace, blockId, highlight, className = 'tutorial-highlight') => {
    const block = workspace.getBlockById(blockId);
    if (block) {
        const blockSvg = block.getSvgRoot();
        if (blockSvg) {
            const blockPath = blockSvg.querySelector('.blocklyPath');
            if (blockPath) {
                if (highlight) {
                    blockPath.classList.add(className);
                    // 必要に応じて Blockly のネイティブグローもトリガーできます
                    // workspace.glowBlock(blockId, true);
                } else {
                    blockPath.classList.remove(className);
                    // workspace.glowBlock(blockId, false);
                }
            }
        }
    }
};

export default highlightBlock;