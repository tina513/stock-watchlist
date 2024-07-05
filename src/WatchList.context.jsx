import React, { useEffect, useReducer } from "react";

export const WatchListContext = React.createContext([]);
export const DispatchContext = React.createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_WATCH_LIST":
      return [...state, ...action.stockInfos];
    case "REMOVE_FROM_WATCH_LIST":
      return state.filter((stockInfo) => stockInfo.ticker !== action.ticker);
    case "REFRESH_WATCH_LIST":
      return action.stockInfos
        ? action.stockInfos
        : state.map((stockInfo) => ({ ticker: stockInfo.ticker }));
  }
};

export const WatchListProvider = ({ children }) => {
  const [stockInfos, dispatch] = useReducer(
    reducer,
    [],
    () => JSON.parse(window.localStorage.getItem("watchlist")) || []
  );

  useEffect(() => {
    localStorage.setItem("watchlist", JSON.stringify(stockInfos));
  }, [stockInfos]);

  return (
    <WatchListContext.Provider value={stockInfos}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </WatchListContext.Provider>
  );
};
