import React, { useState, useEffect, useContext, useRef } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { getStockTickers, getStockPrice } from "../api/getStockInfo";
import { WatchListContext, DispatchContext } from "../WatchList.context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const SearchBar = () => {
  const watchListData = useContext(WatchListContext);
  const dispatch = useContext(DispatchContext);

  const [searchTerm, setSearchTerm] = useState("");
  const [availableTickers, setAvailableTickers] = useState([]);
  const [open, setOpen] = useState(false);
  const [commandItemValue, setCommandItemValue] = useState("");
  const [selectedTicker, setSelectedTicker] = useState("");
  const [newFavorite, setNewFavorite] = useState("");

  const timerRef = useRef(null);

  // Search available tickers from user input
  useEffect(() => {
    if (!searchTerm) {
      return;
    }

    const getAllAvailableStockerTickers = async () => {
      const tickers = await getStockTickers(searchTerm);
      // Populate command dropdown list with search results
      setAvailableTickers(tickers);
    };
    getAllAvailableStockerTickers();
  }, [searchTerm]);

  // Add favorite stock to watchlist
  useEffect(() => {
    if (!newFavorite) {
      return;
    }

    // Prevent adding in already favorited ticker to watchlist
    if (
      watchListData.find(({ ticker }) => ticker === newFavorite) !== undefined
    ) {
      setNewFavorite("");
      return;
    }

    const getTickersInfo = async () => {
      try {
        const stockInfos = await getStockPrice([newFavorite]);
        dispatch({ type: "ADD_TO_WATCH_LIST", stockInfos });
        setNewFavorite("");
      } catch (error) {
        dispatch({ type: "ADD_TO_WATCH_LIST", stockInfos: [] });
      }
    };
    getTickersInfo();
  }, [newFavorite, watchListData]);

  // Update watchlist prices for every 5 second
  useEffect(() => {
    if (!watchListData.length) {
      return;
    }
    let active = true;
    timerRef.current = setInterval(() => {
      const watchListTickers = watchListData.map(
        (stockInfo) => stockInfo.ticker
      );
      const refreshTickersInfo = async () => {
        try {
          const stockInfos = await getStockPrice(watchListTickers);
          if (active) {
            dispatch({ type: "REFRESH_WATCH_LIST", stockInfos });
          }
        } catch (error) {
          dispatch({ type: "REFRESH_WATCH_LIST" });
        }
      };
      refreshTickersInfo();
    }, 5 * 1000);

    return () => {
      active = false;
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [watchListData]);

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {commandItemValue
              ? selectedTicker ||
                availableTickers.find(
                  (ticker) => ticker.value === commandItemValue
                )?.label
              : "Select Stock Ticker"}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput
              placeholder="Search Stock Ticker"
              value={searchTerm}
              onValueChange={(e) => setSearchTerm(e)}
            />
            <CommandList>
              <CommandEmpty>No ticker found.</CommandEmpty>
              <CommandGroup>
                {availableTickers.map((ticker) => (
                  <CommandItem
                    key={ticker.label}
                    value={ticker.value}
                    onSelect={(currentValue) => {
                      setCommandItemValue(
                        currentValue.value === commandItemValue
                          ? ""
                          : currentValue
                      );
                      setOpen(false);
                      setSelectedTicker(ticker.label);
                      setSearchTerm("");
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        commandItemValue.label === ticker
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {ticker.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Button
        className="ml-1"
        onClick={() => {
          setNewFavorite(selectedTicker);
          setAvailableTickers([]);
          setCommandItemValue("");
        }}
      >
        Add
      </Button>
    </div>
  );
};

export default SearchBar;
