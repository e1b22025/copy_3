import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import bindAll from 'lodash.bindall'; // bindAllは必要なくなったものの、他の場所で使われている可能性があるので残しておきますが、今回は使いません。
import debounce from 'lodash.debounce';
import {compose} from 'redux';
import {connect} from 'react-redux';
import ReactModal from 'react-modal';
import VM from 'scratch-vm';
import {injectIntl, intlShape} from 'react-intl';

import ErrorBoundaryHOC from '../lib/error-boundary-hoc.jsx';
import {
    getIsError,
    getIsShowingProject
} from '../reducers/project-state';
import {
    activateTab,
    BLOCKS_TAB_INDEX,
    COSTUMES_TAB_INDEX,
    SOUNDS_TAB_INDEX
} from '../reducers/editor-tab';

import {
    closeCostumeLibrary,
    closeBackdropLibrary,
    closeTelemetryModal,
    openExtensionLibrary,
    closeDebugModal
} from '../reducers/modals';

import FontLoaderHOC from '../lib/font-loader-hoc.jsx';
import LocalizationHOC from '../lib/localization-hoc.jsx';
import SBFileUploaderHOC from '../lib/sb-file-uploader-hoc.jsx';
import ProjectFetcherHOC from '../lib/project-fetcher-hoc.jsx';
import TitledHOC from '../lib/titled-hoc.jsx';
import ProjectSaverHOC from '../lib/project-saver-hoc.jsx';
import QueryParserHOC from '../lib/query-parser-hoc.jsx';
import storage from '../lib/storage';
import vmListenerHOC from '../lib/vm-listener-hoc.jsx';
import vmManagerHOC from '../lib/vm-manager-hoc.jsx';
import cloudManagerHOC from '../lib/cloud-manager-hoc.jsx';
import systemPreferencesHOC from '../lib/system-preferences-hoc.jsx';

import GUIComponent from '../components/gui/gui.jsx';
import {setIsScratchDesktop} from '../lib/isScratchDesktop.js';
import html2canvas from 'html2canvas';


import {
  getSortedBlockIds,
  highlightBlocksSequentially
} from '../lib/highlight-helper';

import highlightBlock from '../lib/highlight-block';

const {RequestMetadata, setMetadata, unsetMetadata} = storage.scratchFetch;

const setProjectIdMetadata = projectId => {
    // If project ID is '0' or zero, it's not a real project ID. In that case, remove the project ID metadata.
    // Same if it's null undefined.
    if (projectId && projectId !== '0') {
        setMetadata(RequestMetadata.ProjectId, projectId);
    } else {
        unsetMetadata(RequestMetadata.ProjectId);
    }
};

class GUI extends React.Component {

    constructor(props) {
        super(props);
        // 📸 `bindAll` はこのプロジェクトのスタイルに合わないため削除しました。
        // 代わりに、メソッドはアロー関数として定義するか、個別にバインドします。
        // ここでバインドが必要な既存のメソッドがあれば、個別に `this.methodName = this.methodName.bind(this);` のように追加してください。
        this.blocksDOMElement = null; // BlocklyワークスペースのDOM要素を格納
    }

    // 📸 ここを新しく追加: BlocksコンポーネントからDOM要素を受け取るコールバック（アロー関数で自動バインド）
    onBlocksDOMRef = (domElement) => {
        this.blocksDOMElement = domElement;
        console.log('Blocks DOM Element:', domElement); // 📸 この行を追加
    if (domElement) {
        console.log('DOM Element is valid, its tag name is:', domElement.tagName);
    } else {
        console.log('DOM Element is null or undefined.');
    }
    };

    // 📸 スクリーンショットを撮るメソッド（アロー関数で自動バインド）
    onScreenshotClick = () => {
        console.log('スクリーンショットボタンがクリックされました！'); // 📸 この行を追加
        if (this.blocksDOMElement) {
            console.log('html2canvasでキャプチャ対象のDOM要素:', this.blocksDOMElement); // 📸 この行を追加
            html2canvas(this.blocksDOMElement, {
                useCORS: true,
                scrollX: -window.scrollX,
                scrollY: -window.scrollY,
                windowWidth: document.documentElement.offsetWidth,
                windowHeight: document.documentElement.offsetHeight
            }).then(canvas => {
                 console.log('html2canvasでキャプチャが成功しました。画像をダウンロードします。'); // 📸 この行を追加
                const link = document.createElement('a');
                link.download = 'scratch_program_screenshot.png';
                link.href = canvas.toDataURL('image/png');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }).catch(err => {
                console.error("スクリーンショットの生成中にエラーが発生しました:", err);
            });
        } else {
            console.warn("スクリーンショットを撮るためのDOM要素が見つかりませんでした。");
        }
    };


    componentDidMount () {
        setIsScratchDesktop(this.props.isScratchDesktop);
        this.props.onStorageInit(storage);
        this.props.onVmInit(this.props.vm);
        setProjectIdMetadata(this.props.projectId);

        setTimeout(() => {
            // 📸 this.blocksDOMElement に `workspace` プロパティが直接あるかは、
            // Blocklyの注入方法に依存します。もしエラーが発生する場合は、
            // `this.blocksDOMElement.querySelector('.blocklyWorkspace')`
            // のように、内部の要素を特定する必要があるかもしれません。
            const workspace = this.blocksDOMElement?.workspace;
            if (workspace) {
                const moveBlock = workspace.getAllBlocks(false).find(block => block.type === 'motion_movesteps');
                 if (moveBlock) {
                    highlightBlock(workspace, moveBlock.id, true);
                    setTimeout(() => {
                        highlightBlock(workspace, moveBlock.id, false);
                    }, 10000);
                } else {
                    console.warn('「10歩動かす」ブロックが見つかりませんでした');
                }
            }
        }, 8000);
    }
    componentDidUpdate (prevProps) {
        if (this.props.isShowingProject && !prevProps.isShowingProject) {
            const workspace = this.blocksDOMElement?.workspace;
            if (workspace) {
                const highlightNextBackdropBlock = () => {
                    const targetBlock = workspace.getAllBlocks(false).find(
                        block => block.type === 'looks_nextbackdrop'
                    );
                    if (targetBlock) {
                        highlightBlock(workspace, targetBlock.id, true);
                    }
                };

                highlightNextBackdropBlock();

                workspace.addChangeListener(() => {
                    highlightNextBackdropBlock();
                });
            }
        }

        if (this.props.projectId !== prevProps.projectId) {
            if (this.props.projectId !== null) {
                this.props.onUpdateProjectId(this.props.projectId);
            }
            setProjectIdMetadata(this.props.projectId);
        }
        if (this.props.isShowingProject && !prevProps.isShowingProject) {
            this.props.onProjectLoaded();

            const workspace = this.blocksDOMElement?.workspace;
            if (workspace) {
                const targetBlock = workspace.getAllBlocks(false).find(
                    block => block.type === 'looks_nextbackdrop'
                );
                if (targetBlock) {
                    const blockSvg = targetBlock.getSvgRoot();
                    if (blockSvg) {
                        blockSvg.style.stroke = 'red';
                        blockSvg.style.strokeWidth = '4px';
                    }
                }
            }

        }
        if (this.props.shouldStopProject && !prevProps.shouldStopProject) {
            this.props.vm.stopAll();
        }
    }
    render () {
        if (this.props.isError) {
            throw new Error(
                `Error in Scratch GUI [location=${window.location}]: ${this.props.error}`);
        }
        const {
            /* eslint-disable no-unused-vars */
            assetHost,
            cloudHost,
            error,
            isError,
            isScratchDesktop,
            isShowingProject,
            onProjectLoaded,
            onStorageInit,
            onUpdateProjectId,
            onVmInit,
            projectHost,
            projectId,
            /* eslint-enable no-unused-vars */
            children,
            fetchingProject,
            isLoading,
            loadingStateVisible,
            // setBlocksRef, // 📸 削除
            ...componentProps
        } = this.props;
        return (
            <GUIComponent
                loading={fetchingProject || isLoading || loadingStateVisible}
                {...componentProps}
                onScreenshotClick={this.onScreenshotClick} // 📸 Controlsに渡すハンドラ
                onBlocksRef={this.onBlocksDOMRef} // 📸 GUIComponentにDOM参照コールバックを渡す
            >
                {children}
            </GUIComponent>
        );
    }
}

GUI.propTypes = {
    assetHost: PropTypes.string,
    children: PropTypes.node,
    cloudHost: PropTypes.string,
    error: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
    fetchingProject: PropTypes.bool,
    intl: intlShape,
    isError: PropTypes.bool,
    isLoading: PropTypes.bool,
    isScratchDesktop: PropTypes.bool,
    isShowingProject: PropTypes.bool,
    isTotallyNormal: PropTypes.bool,
    loadingStateVisible: PropTypes.bool,
    onProjectLoaded: PropTypes.func,
    onSeeCommunity: PropTypes.func,
    onStorageInit: PropTypes.func,
    onUpdateProjectId: PropTypes.func,
    onVmInit: PropTypes.func,
    projectHost: PropTypes.string,
    projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    shouldStopProject: PropTypes.bool,
    telemetryModalVisible: PropTypes.bool,
    vm: PropTypes.instanceOf(VM).isRequired
};

GUI.defaultProps = {
    isScratchDesktop: false,
    isTotallyNormal: false,
    onStorageInit: storageInstance => storageInstance.addOfficialScratchWebStores(),
    onProjectLoaded: () => {},
    onUpdateProjectId: () => {},
    onVmInit: (/* vm */) => {}
};

const mapStateToProps = state => {
    const loadingState = state.scratchGui.projectState.loadingState;
    return {
        activeTabIndex: state.scratchGui.editorTab.activeTabIndex,
        alertsVisible: state.scratchGui.alerts.visible,
        backdropLibraryVisible: state.scratchGui.modals.backdropLibrary,
        blocksTabVisible: state.scratchGui.editorTab.activeTabIndex === BLOCKS_TAB_INDEX,
        cardsVisible: state.scratchGui.cards.visible,
        connectionModalVisible: state.scratchGui.modals.connectionModal,
        costumeLibraryVisible: state.scratchGui.modals.costumeLibrary,
        costumesTabVisible: state.scratchGui.editorTab.activeTabIndex === COSTUMES_TAB_INDEX,
        debugModalVisible: state.scratchGui.modals.debugModal,
        error: state.scratchGui.projectState.error,
        isError: getIsError(loadingState),
        isFullScreen: state.scratchGui.mode.isFullScreen,
        isPlayerOnly: state.scratchGui.mode.isPlayerOnly,
        isRtl: state.locales.isRtl,
        isShowingProject: getIsShowingProject(loadingState),
        loadingStateVisible: state.scratchGui.modals.loadingProject,
        projectId: state.scratchGui.projectState.projectId,
        soundsTabVisible: state.scratchGui.editorTab.activeTabIndex === SOUNDS_TAB_INDEX,
        targetIsStage: (
            state.scratchGui.targets.stage &&
            state.scratchGui.targets.stage.id === state.scratchGui.targets.editingTarget
        ),
        telemetryModalVisible: state.scratchGui.modals.telemetryModal,
        tipsLibraryVisible: state.scratchGui.modals.tipsLibrary,
        vm: state.scratchGui.vm
    };
};

const mapDispatchToProps = dispatch => ({
    onExtensionButtonClick: () => dispatch(openExtensionLibrary()),
    onActivateTab: tab => dispatch(activateTab(tab)),
    onActivateCostumesTab: () => dispatch(activateTab(COSTUMES_TAB_INDEX)),
    onActivateSoundsTab: () => dispatch(activateTab(SOUNDS_TAB_INDEX)),
    onRequestCloseBackdropLibrary: () => dispatch(closeBackdropLibrary()),
    onRequestCloseCostumeLibrary: () => dispatch(closeCostumeLibrary()),
    onRequestCloseDebugModal: () => dispatch(closeDebugModal()),
    onRequestCloseTelemetryModal: () => dispatch(closeTelemetryModal())
});

const ConnectedGUI = injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(GUI));

const WrappedGui = compose(
    LocalizationHOC,
    ErrorBoundaryHOC('Top Level App'),
    FontLoaderHOC,
    QueryParserHOC,
    ProjectFetcherHOC,
    TitledHOC,
    ProjectSaverHOC,
    vmListenerHOC,
    vmManagerHOC,
    SBFileUploaderHOC,
    cloudManagerHOC,
    systemPreferencesHOC
)(ConnectedGUI);

WrappedGui.setAppElement = ReactModal.setAppElement;
export default WrappedGui;