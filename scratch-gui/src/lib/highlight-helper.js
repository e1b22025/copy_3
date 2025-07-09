// src/lib/highlight-helper.js

export function getAllBlockIds(workspace) {
  const blocks = workspace.getAllBlocks(false);
  return blocks.map(block => block.id);
}

export function getSortedBlockIds(workspace) {
  const blocks = workspace.getAllBlocks(false);
  blocks.sort((a, b) => a.getRelativeToSurfaceXY().y - b.getRelativeToSurfaceXY().y);
  return blocks.map(block => block.id);
}

export function highlightBlocksSequentially(workspace, blockIds, delay = 1000) {
  let index = 0;
  function highlightNext() {
    if (index > 0) {
      const prevBlock = workspace.getBlockById(blockIds[index - 1]);
      if (prevBlock) prevBlock.unselect();
    }
    if (index < blockIds.length) {
      const block = workspace.getBlockById(blockIds[index]);
      if (block) block.select();
      index++;
      setTimeout(highlightNext, delay);
    }
  }
  highlightNext();
}
