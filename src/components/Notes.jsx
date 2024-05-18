import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ReactHtmlParser from 'react-html-parser';

const Notes = ({ videoId, playerRef }) => {
    const [notes, setNotes] = useState([]);
    const [noteContent, setNoteContent] = useState('');
    const [isTextareaVisible, setIsTextareaVisible] = useState(false);
    const [editNoteId, setEditNoteId] = useState(null);

    useEffect(() => {
        const savedNotes = JSON.parse(localStorage.getItem(videoId)) || [];
        setNotes(savedNotes);
    }, [videoId]);

    const handleButtonClick = () => {
        setIsTextareaVisible(!isTextareaVisible);
        setNoteContent('');
        setEditNoteId(null);
    };

    const handleAddNote = () => {
        if (playerRef.current) {
            const currentTime = playerRef.current.getCurrentTime();
            const timestamp = Math.floor(currentTime);

            const newNote = {
                id: editNoteId || Date.now(),
                timestamp,
                date: new Date().toLocaleString(),
                content: noteContent,
            };

            const updatedNotes = editNoteId
                ? notes.map(note => (note.id === editNoteId ? newNote : note))
                : [...notes, newNote];

            setNotes(updatedNotes);
            localStorage.setItem(videoId, JSON.stringify(updatedNotes));
            setNoteContent('');
            setIsTextareaVisible(false);
            setEditNoteId(null);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = { day: 'numeric', month: 'short', year: '2-digit' };
        return date.toLocaleDateString('en-GB', options);
    };

    const handleDeleteNote = (id) => {
        const updatedNotes = notes.filter(note => note.id !== id);
        setNotes(updatedNotes);
        localStorage.setItem(videoId, JSON.stringify(updatedNotes));
    };

    const handleJumpToTimestamp = (timestamp) => {
        if (playerRef.current) {
            playerRef.current.seekTo(timestamp);
        }
    };

    const handleEditNote = (note) => {
        setNoteContent(note.content);
        setIsTextareaVisible(true);
        setEditNoteId(note.id);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64Image = reader.result;
            setNoteContent(prevContent => prevContent + `<img src="${base64Image}" alt="Uploaded Image"/>`);
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="notes-container w-full h-auto gap-6 py-6 px-6 mt-6 rounded-[16px] border-[1px] border-solid border-[#EAECF0]">
            <div className="flex justify-between items-start pb-3">
                <div>
                    <h1 className="text-xl font-semibold font-inter">My notes</h1>
                    <p className="text-gray-600 mt-1">All your notes at a single place. Click on any note to go to a specific timestamp in the video.</p>
                </div>
                <button
                    className="h-[40px] w-[150px] rounded-[8px] border border-solid border-[#e7edf5] shadow-sm text-sm font-semibold font-inter text-center text-[#344054] hover:text-black hover:bg-[#fdfdfd] transition-colors duration-300"
                    onClick={handleButtonClick}
                >
                    <svg
                        style={{ display: 'inline-block' }}
                        className="my-2 transition-colors duration-300"
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M10 6.66669V13.3334M6.66669 10H13.3334M18.3334 10C18.3334 14.6024 14.6024 18.3334 10 18.3334C5.39765 18.3334 1.66669 14.6024 1.66669 10C1.66669 5.39765 5.39765 1.66669 10 1.66669C14.6024 1.66669 18.3334 5.39765 18.3334 10Z"
                            stroke="#667085"
                            strokeWidth="1.66667"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                    <span className="pl-2">{editNoteId ? 'Edit note' : 'Add new note'}</span>
                </button>
            </div>
            <hr />
            {isTextareaVisible && (
                <div className="relative mt-4">
                    <ReactQuill
                        theme="snow"
                        value={noteContent}
                        onChange={setNoteContent}
                        modules={{
                            toolbar: [
                                [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                [{ size: [] }],
                                ['bold', 'italic', 'underline'],
                                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                [{ 'script': 'sub'}, { 'script': 'super' }],
                                [{ 'indent': '-1'}, { 'indent': '+1' }, { 'direction': 'rtl' }],
                                [{ 'color': [] }, { 'background': [] }],
                                ['clean']
                            ]
                        }}
                    />
                    <div className='flex justify-between'>
                    <input type="file" onChange={handleImageUpload} className='mt-2'/>
                    <button
                        className="relative mt-2 py-1.5 px-1.5 rounded-[8px] border border-solid border-[#D0D5DD] shadow-sm text-sm font-semibold font-inter text-center text-[#344054] hover:text-black hover:bg-[#fdfdfd] transition-colors duration-300"
                        onClick={handleAddNote}
                    >
                        Save note
                    </button>
                    </div>
                </div>
            )}
            <ul className="notes-list pl-3">
                {notes.slice(0).reverse().map((note) => (
                    <li key={note.id} className="note-item mt-2">
                        <span className="note-date">{formatDate(note.date)}</span>
                        <p className="note-meta">
                            <button
                                className="timestamp-button"
                                style={{color:'#6941C6'}}
                                onClick={() => handleJumpToTimestamp(note.timestamp)}
                            >
                                <span className='text-gray-600'>Timestamp:</span> {new Date(note.timestamp * 1000).toISOString().substr(11, 8)}
                            </button>
                        </p>
                        <div className="note-content mt-2 w-full h-auto px-3 py-2 gap-2 border rounded-md  border-solid border-[#EAECF0] shadow-[0px 1px 2px 0px #1018280D] text-gray-600">
                            {ReactHtmlParser(note.content)}
                        </div>
                        <div className="note-actions flex justify-end p-4">
                            <button className="delete-note-button  bottom-3 right-2 py-1.5 px-1.5 mr-3 rounded-[8px] border border-solid border-[#D0D5DD] shadow-sm text-sm font-semibold font-inter text-center text-[#344054] hover:text-black hover:bg-[#fdfdfd] transition-colors duration-300" onClick={() => handleDeleteNote(note.id)}>
                                Delete note
                            </button>
                            <button className="edit-note-button  bottom-3 right-2 py-1.5 px-1.5 rounded-[8px] border border-solid border-[#D0D5DD] shadow-sm text-sm font-semibold font-inter text-center text-[#344054] hover:text-black hover:bg-[#fdfdfd] transition-colors duration-300" onClick={() => handleEditNote(note)}>
                                Edit note
                            </button>
                        </div>
                        <hr />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Notes;
