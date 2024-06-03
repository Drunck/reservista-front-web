type TimeButtonProps = {
  time: string;
  selected: boolean;
  onClick: () => void;
}

type TableButtonProps = {
  tableNumber: number;
  status: "available" | "reserved" | "selected" | string;
  onClick: () => void;
}

export const TimeButton: React.FC<TimeButtonProps> = ({ time, selected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`py-2 px-4 rounded-full border transition text-black active:scale-95 focus:outline-none text-sm min-w-24 max-w-28 w-full md:text-base
                  ${selected 
                    ? "bg-black text-white" 
                    : "bg-white text-gray-700 hover:bg-zinc-200/50"} 
                   `}
    >
      {time}
    </button>
  );
};


export const TableButton: React.FC<TableButtonProps> = ({ tableNumber, status, onClick }) => {
  if (status === 'reserved') {
    return (
      <div className={`py-4 px-6 rounded-lg border transition bg-red-200 border-red-400 cursor-not-allowed text-center text-sm md:text-base`} >
        Table {tableNumber}
      </div>
    );
  }

  return (
    <button
      onClick={onClick}
      className={`py-4 px-6 rounded-lg border transition active:scale-95 text-sm md:text-base
                  ${status === "selected" 
                  ? "bg-black border-black text-white hover:bg-black" 
                  : "bg-white border-gray-200 hover:bg-zinc-200/50"} 
                   focus:outline-none`}
    >
      Table {tableNumber}
    </button>
  );
};