import { useEffect, useRef, useState } from "react";
import logoOne from "../assets/1.gif";
import logoTwo from "../assets/2.gif";
import logoThree from "../assets/3.gif";
import logoFour from "../assets/4.gif";
import logoFive from "../assets/5.gif";

const InfiniteScroll = (props) => {
  const loadingScreens = [logoOne, logoTwo, logoThree, logoFour, logoFive];
  const {
    renderListItem,
    getData,
    listData,
    apiQuery: inputPhrase,
    noData,
  } = props;
  const pageNumber = useRef(1);
  const [loading, setLoading] = useState(false);
  const observer = useRef(null);

  const lastElementOberver = (node) => {
    if (loading) {
      return;
    }
    if (observer.current) {
      observer.current.disconnect();
    }
    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        pageNumber.current += 1;
        fetchItems();
      }
    });
    if (node) {
      observer.current.observe(node);
    }
  };

  const renderList = () => {
    if (noData) {
      return <span>No items found</span>;
    }

    return listData.map((currentItem, index) => {
      if (index === listData.length - 1) {
        return renderListItem(currentItem, lastElementOberver);
      }

      return renderListItem(currentItem, null);
    });
  };

  const fetchItems = () => {
    setLoading(true);
    getData(inputPhrase, pageNumber.current).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchItems();
    }, 300);
    return () => {
      clearTimeout(debounceTimer);
    };
  }, [inputPhrase]);

  return (
    <>
      <div class='grid grid-cols-4 gap-4 p-2 m-2'>{renderList()}</div>
      {loading && (
        <div class='container'>
          <img
            class='mx-auto d-flex align-items-center'
            src={loadingScreens[Math.floor(Math.random() * (4 - 0) + 0)]}
            alt='loading'
          />
        </div>
      )}
    </>
  );
};

export default InfiniteScroll;
