import React, { useContext } from "react";
import { DispatchContext } from "../../WatchList.context";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const RowDeleteHandleCell = ({ ticker }) => {
  const dispatch = useContext(DispatchContext);
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        dispatch({ type: "REMOVE_FROM_WATCH_LIST", ticker });
      }}
    >
      <Trash2 className="h-4 w-4" color="#eb4034" />
    </Button>
  );
};

export default RowDeleteHandleCell;
