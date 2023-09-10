import React, { useState } from "react";
import InfiniteScroll from "./components/InfiniteScroll";

function InfiniteScrollWithDebouncing(props) {
  const [inputPhrase, setApiQuery] = useState("");
  const [items, setItems] = useState([]);
  const [noItems, setNoItems] = useState(false);

  const searchItems = (e) => {
    setItems([]);
    setNoItems(false);
    setApiQuery(e.target.value);
    if (e.target.value.length === 0) {
      setItems([]);
    }
  };

  const renderItem = ({ title, key }, ref) => {
    return (
      <div
        class='d-inline-flex p-2 border border-2 border-primary m-2 rounded-2 h5 flex-wrap color-blue'
        key={key + "_" + title}
        ref={ref}
      >
        {title}
      </div>
    );
  };

  const getItems = (apiQuery, pageNumber) => {
    return new Promise((resolve, reject) => {
      if (apiQuery) {
        try {
          fetch(
            "https://openlibrary.org/search.json?" +
              new URLSearchParams({
                q: apiQuery,
                page: pageNumber,
              })
          ).then((res) => {
            res.json().then((data) => {
              resolve();
              if (data.docs.length === 0) {
                setNoItems(true);
              }
              setItems((prevData) => [...prevData, ...data.docs]);
            });
          });
        } catch (err) {
          reject();
        }
      }
    });
  };

  return (
    <>
      <div className='play-details'>
        <div className='play-details-body'>
          <div>
            <h1 class='m-2 text-gray-800 text-lg font-bold'>
              Welcome to Infinite Scrolling 🎡
            </h1>
            <input
              className='border-solid border-2 border-black rounded-2 m-2 h5'
              placeholder=' Items search...'
              type='text'
              primary
              value={inputPhrase}
              onChange={searchItems}
            />
            {inputPhrase !== "" && (
              <InfiniteScroll
                class='border-solid border-primary'
                apiQuery={inputPhrase}
                getData={getItems}
                listData={items}
                noData={noItems}
                renderListItem={renderItem}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default InfiniteScrollWithDebouncing;
