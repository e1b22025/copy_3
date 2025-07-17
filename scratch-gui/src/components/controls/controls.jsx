import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, injectIntl, intlShape} from 'react-intl';

import GreenFlag from '../green-flag/green-flag.jsx';
import StopAll from '../stop-all/stop-all.jsx';
import TurboMode from '../turbo-mode/turbo-mode.jsx';
import IconButton from '../icon-button/icon-button.jsx'; // 新しく追加

import styles from './controls.css';

const messages = defineMessages({
    goTitle: {
        id: 'gui.controls.go',
        defaultMessage: 'Go',
        description: 'Green flag button title'
    },
    stopTitle: {
        id: 'gui.controls.stop',
        defaultMessage: 'Stop',
        description: 'Stop button title'
    },
     screenshotTitle: { // 新しく追加
        id: 'gui.controls.screenshot',
        defaultMessage: 'Screenshot',
        description: 'Screenshot button title'
    }
});

const Controls = function (props) {
    const {
        active,
        className,
        intl,
        onGreenFlagClick,
        onStopAllClick,
        onScreenshotClick, // 新しく追加
        turbo,
        ...componentProps
    } = props;
    console.log('ControlsComponent で onScreenshotClick を受け取りました:', onScreenshotClick); // 📸 この行を追加

    return (
        <div
            className={classNames(styles.controlsContainer, className)}
            {...componentProps}
        >
            <GreenFlag
                active={active}
                title={intl.formatMessage(messages.goTitle)}
                onClick={onGreenFlagClick}
            />
            <StopAll
                active={active}
                title={intl.formatMessage(messages.stopTitle)}
                onClick={onStopAllClick}
            />
            <IconButton // 新しく追加
                className={styles.screenshotButton} // 新しいスタイルクラスを適用
                title={intl.formatMessage(messages.screenshotTitle)}
                onClick={() => { // 📸 ここを修正: 直接無名関数でログを出力
                    console.log('スクリーンショットボタンが `onClick` で押されました！');
                    if (onScreenshotClick) {
                        onScreenshotClick(); // 元のハンドラを呼び出す
                    }
                }}
            >
                {/* ここにスクリーンショットボタンのアイコンを配置します */}
                {/* 例: <img src={cameraIcon} /> または SVG など */}
                {/* 現状はテキストで「SS」と表示します */}
                SS
            </IconButton>
            {turbo ? (
                <TurboMode />
            ) : null}
        </div>
    );
};

Controls.propTypes = {
    active: PropTypes.bool,
    className: PropTypes.string,
    intl: intlShape.isRequired,
    onGreenFlagClick: PropTypes.func.isRequired,
    onStopAllClick: PropTypes.func.isRequired,
    onScreenshotClick: PropTypes.func.isRequired, // 新しく追加
    turbo: PropTypes.bool
};

Controls.defaultProps = {
    active: false,
    turbo: false,
    onScreenshotClick: () => {} // デフォルトの空関数を設定
};

export default injectIntl(Controls);
