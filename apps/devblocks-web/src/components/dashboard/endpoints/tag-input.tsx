import React, { useState } from 'react';

const TagInput = ({ tags, setTags }: any) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAddTag = () => {
    if (inputValue.trim() !== '' && !tags.includes(inputValue.trim())) {
      setTags([...tags, inputValue.trim()]);
      setInputValue('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="flex flex-col">
      <div className='flex space-x-2'>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyPress}
          placeholder="Add a tag"
          className="border border-gray-300 p-2 rounded flex-1"
        />
        <button className='bg-pc p-2 text-white rounded' onClick={() => handleAddTag()}>Add Tag</button>
      </div>
      <div className='flex flex-wrap p-2 border-bc border-2 overflow-y-auto max-h-16 mt-2'>
        {tags.map((tag, index) => (
          <div key={index} className="bg-pc text-white rounded px-3 py-1 m-1 flex items-center text-xs">
            {tag}
            <button
              className="ml-2 font-bold"
              onClick={() => handleRemoveTag(tag)}
              type="button"
            >
              X
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={handleAddTag}
        className="bg-green-500 text-white px-3 py-1 rounded ml-2"
        type="button"
      >
        Add Tag
      </button>
    </div>
  );
};

export default TagInput;