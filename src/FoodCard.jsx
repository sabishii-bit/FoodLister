import React, {useState, useRef, useCallback} from 'react';
import axios from 'axios'
import './FoodCard.css'
import { useEffect } from 'react/cjs/react.development';

export default function FoodCard() {
  // State declarations
  const [itemNameData, setItemNameData] = useState([]);
  const [itemQuantityData, setItemQuantityData] = useState([]);
  const [itemTimeData, setItemTimeData] = useState([]);
  const [error, flagError] = useState(false);
  const [loading, flagLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [pageNo, setPageNo] = useState(0);

  // Observer to check what elements are displayed on the screen
  const observer = useRef();
  const lastItemElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        console.log('Visible');
        setPageNo(prevPageNo => prevPageNo + 1);
      }
    });
    if (node) observer.current.observe(node);
    console.log(node);
  }, [loading, hasMore]);

  // UseEffect to obtain data from database on page load
  useEffect(() => {
    flagLoading(true);
    flagError(false);
    fetchData();
  }, [pageNo])

  // Script for call to the back-end to retrieve database query:
  function fetchData() {
    let cancel;
    axios({
      method: 'GET',
      url: '/api',
      params: { page: pageNo },
      cancelToken: new axios.CancelToken(c => cancel = c)
    }).then(res => {
      setItemNameData(prevData => {
        return [...prevData, ...res.data.map(i => i.ItemName).slice(pageNo, pageNo+1)];
      });
      setItemQuantityData(prevData => {
        return [...prevData, ...res.data.map(i => i.ItemQuantity).slice(pageNo, pageNo+1)];
      });
      // -- This section is reserved for creating dummy time data can be redacted if time data is provided to the database -- //
      setItemTimeData(prevData => {
        // 259200 was chosen as the number of seconds in two days, arbitrarily chosen as the maximum span of dummy data
        return [...prevData, Math.floor(Math.random() * 172800)];
      });
      // -- End code for dummy time data population -- //
      setHasMore(res.data.length > 0);
      console.table(itemNameData);
      flagLoading(false);
    }).catch(e => {
      flagError(true);
      if (axios.isCancel(e)) return
    })
  }

  // Div builders
  const divBuildQ = (index) => {
    return(<span className="qSpan">{itemQuantityData[index]} purchased </span>)
  }
  const divBuildN = (index) => {
    return(<span className="nSpan">{itemNameData[index]}</span>)
  }
  const divBuildT = (index) => {
    console.log(itemTimeData[index]);
    if (itemTimeData[index] < 60) {                                             // Less than a minute
      return(<span className="tSpan">{itemTimeData[index]} seconds ago</span>)
    } else if (itemTimeData[index] > 60 && itemTimeData[index] < 3600) {        // More than a minute, less than an hour
      let minutes = Math.trunc(itemTimeData[index]/60);
      return(<span className="tSpan">{minutes} minutes ago</span>)
    } else if (itemTimeData[index] > 3600 && itemTimeData[index] < 86400) {        // More than an hour, less than a day
      let hours = Math.trunc(itemTimeData[index]/3600);
      return(<span className="tSpan">{hours} hours ago</span>)
    } else if (itemTimeData[index] > 86400) {                                   // More than a day
      let days = Math.trunc(itemTimeData[index]/86400);
      return(<span className="tSpan">{days} day(s) ago</span>)
    }
  }

  return (
    <div className="FoodCard">
      <>
        {itemTimeData.map((item, index) => {
          if (itemNameData.length === index + 1) {
          return <div className='Info' ref={lastItemElementRef} key={item}>
            {divBuildN(index)}<br /> {divBuildQ(index)} {divBuildT(index)}
          </div>
          } else {
          return <div className='Info' key={item}>
            {divBuildN(index)}<br /> {divBuildQ(index)} {divBuildT(index)}
          </div>
          }
        })}
        <div>
          {loading && 'Loading...'}
        </div>
        <div>
          {error && 'Error'}
        </div>
      </>
    </div>
  );
}
