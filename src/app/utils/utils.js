import saveAs from 'file-saver';
import APATE from '../apate';

/* globals $, FileError, Blob */

APATE.namespace('APATE.utils');

APATE.utils.utils = (function utils() {
    /**
    * @param {Event} e
    * @return {string} Human-readable error description.
    */
    const fsErrorStr = (e) => {
        switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
            return 'Quota exceeded';
        case FileError.NOT_FOUND_ERR:
            return 'File not found';
        case FileError.SECURITY_ERR:
            return 'Security error';
        case FileError.INVALID_MODIFICATION_ERR:
            return 'Invalid modification';
        case FileError.INVALID_STATE_ERR:
            return 'Invalid state';
        default:
            return 'Unknown Error';
        }
    };

    const handleFSError = (e) => {
        $.event.trigger('filesystemerror');
        console.warn('FS Error:', utils.fsErrorStr(e), e);
    };

    /**
    * @param {string} fileName
    * @param {string} content
    * @param {Function} onsuccess
    * @param {Function?} onerror
    * Truncate the file and write the content.
    */
    const writeFile = (fileName, content, onsuccess, onerror) => {
        try {
            const blob = new Blob([content], {type: 'text/plain'});
            saveAs(blob, fileName);
            onsuccess();
        }
        catch (e) {
            if (onerror) {
                onerror(e);
            }
        }
    };

    /**
    * @param {FileWriter} writer
    * @param {!Blob} blob
    * @param {Function} onsuccess
    */
    const writeToWriter = (writer, blob, onsuccess) => {
        writer.onwrite = onsuccess;
        writer.write(blob);
    };

    /**
    * @param {string} fileName
    * @return {string} Sanitized File name.
    * Returns a sanitized version of a File Name.
    */
    const sanitizeFileName = (fileName) => {
        return fileName.replace(/[^a-z0-9\-]/gi, ' ').substr(0, 50).trim();
    };

    /**
    * @param {string} fileName
    * @return {?string} Extension.
    * Returns the extension of a File Name or null if there's none.
    */
    const getExtension = (fileName) => {
        var match = /\.([^.\\\/]+)$/.exec(fileName);
        if (match) {
            return match[1];
        } else {
            return null;
        }
    };

    /*
    * @param {?string} [text] Text content.
    * @return {string} Line endings.
    * Returns guessed line endings or LF if not successful.
    */
    const guessLineEndings = (text) => {
        if (!text) {
            return '\n';
        }
        var indexOfLF = text.indexOf('\n');
        var hasCRLF = (indexOfLF > 0) && (text[indexOfLF - 1] === '\r');

        return (hasCRLF ? '\r\n' : '\n');
    };

    return {
        fsErrorStr: fsErrorStr,
        handleFSError: handleFSError,
        writeFile: writeFile,
        writeToWriter_: writeToWriter,
        sanitizeFileName: sanitizeFileName,
        getExtension: getExtension,
        guessLineEndings: guessLineEndings
    };

}());

export default APATE.utils.utils;
