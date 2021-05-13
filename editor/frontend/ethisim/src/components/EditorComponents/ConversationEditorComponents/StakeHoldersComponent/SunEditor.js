import React from 'react';
import Typography from '@material-ui/core/Typography';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import PropTypes from 'prop-types';

SunEditorForConversationEditor.propTypes = {
    body: PropTypes.string.isRequired,
    setBody: PropTypes.any.isRequired,
    error: PropTypes.bool,
    errorMessage: PropTypes.string,
};

export default function SunEditorForConversationEditor(props) {
    const { body, setBody, error, errorMessage } = props;
    var firstTime = true;
    //Executes handleChange when you first click on the text editor
    //There are no unsaved changes until a person types something in
    let handleChange = (content) => {
        if (firstTime) {
            setBody(content, true);
            firstTime = false;
        } else {
            setBody(content, false);
        }
    };

    return (
        <div>
            <SunEditor
                setContents={body}
                setOptions={{
                    width: '100%',
                    height: 400,
                    placeholder: 'Enter in body...',
                    buttonList: [
                        ['font', 'fontSize', 'formatBlock'],
                        ['paragraphStyle', 'blockquote'],
                        [
                            'bold',
                            'underline',
                            'italic',
                            'strike',
                            'subscript',
                            'superscript',
                        ],
                        ['fontColor', 'hiliteColor', 'textStyle'],
                        '/', // Line break
                        ['undo', 'redo'],
                        ['removeFormat'],
                        ['outdent', 'indent'],
                        ['align', 'horizontalRule', 'list', 'lineHeight'],
                        ['table', 'link', 'image', 'video', 'audio'],
                        ['fullScreen', 'showBlocks', 'codeView'],
                        ['preview'],
                        // (min-width: 800px)
                        [
                            '%800',
                            [
                                ['undo', 'redo'],
                                [
                                    ':p-More Paragraph-default.more_paragraph',
                                    'font',
                                    'fontSize',
                                    'formatBlock',
                                    'paragraphStyle',
                                    'blockquote',
                                ],
                                ['bold', 'underline', 'italic', 'strike'],
                                [
                                    ':t-More Text-default.more_text',
                                    'subscript',
                                    'superscript',
                                    'fontColor',
                                    'hiliteColor',
                                    'textStyle',
                                ],
                                ['removeFormat'],
                                ['outdent', 'indent'],
                                [
                                    ':e-More Line-default.more_horizontal',
                                    'align',
                                    'horizontalRule',
                                    'list',
                                    'lineHeight',
                                ],
                                [
                                    '-right',
                                    ':i-More Misc-default.more_vertical',
                                    'fullScreen',
                                    'showBlocks',
                                    'codeView',
                                    'preview',
                                ],
                                [
                                    '-right',
                                    ':r-More Rich-default.more_plus',
                                    'table',
                                    'link',
                                    'image',
                                    'video',
                                    'audio',
                                ],
                            ],
                        ],
                        // (min-width: 600px)
                        [
                            '%600',
                            [
                                ['undo', 'redo'],
                                [
                                    ':p-More Paragraph-default.more_paragraph',
                                    'font',
                                    'fontSize',
                                    'formatBlock',
                                    'paragraphStyle',
                                    'blockquote',
                                ],
                                [
                                    ':t-More Text-default.more_text',
                                    'bold',
                                    'underline',
                                    'italic',
                                    'strike',
                                    'subscript',
                                    'superscript',
                                    'fontColor',
                                    'hiliteColor',
                                    'textStyle',
                                    'removeFormat',
                                ],
                                [
                                    ':e-More Line-default.more_horizontal',
                                    'outdent',
                                    'indent',
                                    'align',
                                    'horizontalRule',
                                    'list',
                                    'lineHeight',
                                ],
                                [
                                    ':r-More Rich-default.more_plus',
                                    'table',
                                    'link',
                                    'image',
                                    'video',
                                    'audio',
                                ],
                                [
                                    '-right',
                                    ':i-More Misc-default.more_vertical',
                                    'fullScreen',
                                    'showBlocks',
                                    'codeView',
                                    'preview',
                                ],
                            ],
                        ],
                    ],
                }}
                onChange={handleChange}
            />
            {error ? (
                <Typography
                    style={{ marginLeft: 15 }}
                    variant="caption"
                    display="block"
                    color="error"
                >
                    {errorMessage}
                </Typography>
            ) : null}
        </div>
    );
}
