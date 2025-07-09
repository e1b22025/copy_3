
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import {defineMessages, FormattedMessage, injectIntl, intlShape} from 'react-intl';

import Label from '../forms/label.jsx';
import Input from '../forms/input.jsx';
import IconButton from '../icon-button/icon-button.jsx';

import styles from './hint-editor.css';

import saveIcon from './icon--save.svg';
import deleteIcon from './icon--delete.svg';
import highlightIcon from './icon--highlight.svg';
import shuffleIcon from './icon--shuffle.svg';

const BufferedInput = BufferedInputHOC(Input);

const messages = defineMessages({
    hint: {
        id: 'gui.hintEditor.hint',
        description: 'Label for the name of the hint',
        defaultMessage: 'Hint'
    },
    save: {
        id: 'gui.hintEditor.save',
        description: 'Title of the button to save the hint',
        defaultMessage: 'Save'
    },
    delete: {
        id: 'gui.hintEditor.delete',
        description: 'Title of the button to delete the hint',
        defaultMessage: 'Delete'
    },
    highlight: {
        id: 'gui.hintEditor.highlight',
        description: 'Title of the button to highlight the hint',
        defaultMessage: 'Highlight'
    },
    shuffle: {
        id: 'gui.hintEditor.shuffle',
        description: 'Title of the button to shuffle words in the hint',
        defaultMessage: 'Shuffle Words'
    }
});

const HintEditor = props => (
    <div className={styles.editorContainer}>
        <div className={styles.row}>
            <div className={styles.inputGroup}>
                <Label text={props.intl.formatMessage(messages.hint)}>
                    <BufferedInput
                        tabIndex="1"
                        type="text"
                        value={props.name}
                        onSubmit={props.onChangeName}
                    />
                </Label>
                <textarea
                    className={styles.textarea}
                    value={props.content}
                    onChange={props.onChangeContent}
                />
                <div className={styles.buttonGroup}>
                    <IconButton
                        className={styles.toolButton}
                        img={saveIcon}
                        title={props.intl.formatMessage(messages.save)}
                        onClick={props.onSave}
                    />
                    <IconButton
                        className={styles.toolButton}
                        img={deleteIcon}
                        title={props.intl.formatMessage(messages.delete)}
                        onClick={props.onDelete}
                    />
                    <IconButton
                        className={styles.toolButton}
                        img={highlightIcon}
                        title={props.intl.formatMessage(messages.highlight)}
                        onClick={props.onHighlight}
                    />
                    <IconButton
                        className={styles.toolButton}
                        img={shuffleIcon}
                        title={props.intl.formatMessage(messages.shuffle)}
                        onClick={props.onShuffle}
                    />
                </div>
            </div>
        </div>
    </div>
);

HintEditor.propTypes = {
    content: PropTypes.string.isRequired,
    intl: intlShape,
    name: PropTypes.string.isRequired,
    onChangeContent: PropTypes.func.isRequired,
    onChangeName: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    onHighlight: PropTypes.func.isRequired,
    onSave: PropTypes.func.isRequired,
    onShuffle: PropTypes.func.isRequired
};

export default injectIntl(HintEditor);
