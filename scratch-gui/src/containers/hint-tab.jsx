
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';

const HintsTab = ({ intl }) => {
    const [hints, setHints] = useState([
        { text: '「もし〜なら」ブロックを使ってみましょう！' },
        { text: '「繰り返し」ブロックでループを作れます。!' }
    ]);
    const [selectedHintIndex, setSelectedHintIndex] = useState(0);

    const handleSelectHint = (index) => {
        setSelectedHintIndex(index);
    };

    const handleAddHint = (newHint) => {
        setHints(prevHints => [
            ...prevHints,
            { text: newHint }
        ]);
        setSelectedHintIndex(hints.length);
    };

    const handleDeleteHint = (index) => {
        setHints(prevHints => {
            const newHints = [...prevHints];
            newHints.splice(index, 1);
            return newHints;
        });
        setSelectedHintIndex(Math.max(0, index - 1));
    };

    const handleEditHint = (newText) => {
        setHints(prevHints => {
            const newHints = [...prevHints];
            newHints[selectedHintIndex].text = newText;
            return newHints;
        });
    };

    return (
        <div className="hints-tab">
            <ul className="hint-list">
                {hints.map((hint, index) => (
                    <li
                        key={index}
                        className={index === selectedHintIndex ? 'selected' : ''}
                        onClick={() => handleSelectHint(index)}
                    >
                        {hint.text}
                    </li>
                ))}
            </ul>
            <div className="hint-editor">
                <textarea
                    value={hints[selectedHintIndex]?.text || ''}
                    onChange={e => handleEditHint(e.target.value)}
                />
                <button onClick={() => handleAddHint('新しいヒント')}>ヒントを追加</button>
                <button onClick={() => handleDeleteHint(selectedHintIndex)}>削除</button>
            </div>
        </div>
    );
};

HintsTab.propTypes = {
    intl: intlShape.isRequired
};

const mapStateToProps = state => ({
    // Add any necessary state mappings here
});

const mapDispatchToProps = dispatch => ({
    // Add any necessary dispatch mappings here
});

export default injectIntl(connect(
    mapStateToProps,
    mapDispatchToProps
)(HintsTab));
