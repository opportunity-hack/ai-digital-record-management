import API_NAMES from "@/constants/api-names";
import { API, Auth } from "aws-amplify";
import React, { useEffect, useState } from "react";

const TagInput = ({ tags, setTags }: any) => {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    handleUserStoppedTyping();
  }, []);

  const handleUserStoppedTyping = async () => {
    console.log('User stopped typing:', inputValue);
    const result = await API.post(API_NAMES.autocomplete, "",
      {
        headers: {
          Authorization: `Bearer ${(await Auth.currentSession()).getIdToken().getJwtToken()}`,
        },
        body: {
          text: inputValue
        },
      })
    setSuggestions(result.message);
  };

  const [timer, setTimer] = useState<any>();
  const onStoppedTyping = (event: any) => {
    clearTimeout(timer);
    setTimer(setTimeout(() => { handleUserStoppedTyping(); }, 250));
  }

  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
  };

  const handleAddTag = () => {
    if (inputValue.trim() !== "" && !tags.includes(inputValue.trim())) {
      setTags([...tags, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (tagToRemove: any) => {
    setTags(tags.filter((tag: any) => tag !== tagToRemove));
  };

  const handleSelectSuggestion = (suggestion: any) => {
    setInputValue(suggestion);
    setShowSuggestions(false);
  }

  return (
    <div className="flex flex-col">
      <div className="flex space-x-2">
        <input type="text" value={inputValue} onKeyUp={onStoppedTyping} onChange={handleInputChange} onFocus={()=>setShowSuggestions(true)} onKeyDown={handleKeyPress} placeholder="Add a tag" className="flex-1 rounded border border-gray-300 p-2" />
        
        {showSuggestions && suggestions.length > 0 &&
          <div className="absolute bg-white mt-12 h-36 w-64 p-2 border-black border-2 rounded overflow-y-scroll overflow-x-hidden">
            {suggestions.map((suggestion: any, index: any) => (
              <div key={index} className="p-1 hover:bg-gray-200 rounded cursor-pointer" onClick={() => handleSelectSuggestion(suggestion)}>
                {suggestion}
              </div>
            ))}
          </div>}

        <button className="rounded bg-pc p-2 text-white" onClick={() => handleAddTag()} type="button">
          Add Tag
        </button>
      </div>
      <div className="mt-2 flex max-h-16 flex-wrap overflow-y-auto border-2 border-bc p-2">
        {tags.map((tag: any, index: any) => (
          <div key={tag} className="m-1 flex items-center rounded bg-pc px-3 py-1 text-xs text-white">
            {tag}
            <button className="ml-2 font-bold" onClick={() => handleRemoveTag(tag)} type="button">
              X
            </button>
          </div>
        ))}
      </div>
      <button onClick={handleAddTag} className="bg-green-500 ml-2 rounded px-3 py-1 text-white" type="button">
        Add Tag
      </button>
    </div>
  );
};

export default TagInput;
