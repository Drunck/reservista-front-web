import { TRestaurantTables } from "@/lib/types";

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


type TableProps = {
  table: TRestaurantTables;
  onClick: (table: TRestaurantTables) => void;
  isSelected: boolean;
};

type TableLayoutProps = {
  tables: TRestaurantTables[];
  onTableClick: (table: TRestaurantTables) => void;
  selectedTableId: string | undefined;
};

export function TableLayout({ tables, onTableClick, selectedTableId }: TableLayoutProps) {
  return (
    <div className="relative mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-24 p-10 w-full justify-items-center">
      {tables.map((table) => (
        <Table
          key={table.id}
          table={table}
          onClick={onTableClick}
          isSelected={table.id === selectedTableId}
        />
      ))}
    </div>
  );
}

const chairPositions = [
  { top: "-23px", left: "50%", transform: "translateX(-50%)" }, // Top
  { bottom: "-23px", left: "50%", transform: "translateX(-50%)" }, // Bottom
  { top: "50%", left: "-23px", transform: "translateY(-50%)" }, // Left
  { top: "50%", right: "-23px", transform: "translateY(-50%)" }, // Right
  { top: "-23px", left: "25%", transform: "translateX(-50%)" }, // Top Left
  { top: "-23px", right: "25%", transform: "translateX(50%)" }, // Top Right
  { bottom: "-23px", left: "25%", transform: "translateX(-50%)" }, // Bottom Left
  { bottom: "-23px", right: "25%", transform: "translateX(50%)" }, // Bottom Right
];

export function Table({ table, onClick, isSelected }: TableProps) {
  const chairCount = table.number_of_seats;

  if (table.status === "reserved") {
    return (
      <div className={`relative flex items-center justify-center w-24 h-24 border rounded-lg transition bg-red-200 border-red-400 cursor-not-allowed text-sm md:text-base`} >
        <span>Table {table.table_number}</span>
        {chairPositions.slice(0, chairCount).map((pos, index) => (
          <div
            key={index}
            className="absolute w-4 h-4 bg-white border border-gray-500 rounded-full"
            style={{ ...pos }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`relative flex items-center justify-center w-24 h-24 border rounded-lg cursor-pointer transition active:scale-95 text-sm md:text-base
        ${isSelected ? "border-2 border-black" : "bg-white border-gray-500 hover:bg-zinc-200/50"}`}
      onClick={() => onClick(table)}
    >
      <span>Table {table.table_number}</span>
      {chairPositions.slice(0, chairCount).map((pos, index) => (
        <div
          key={index}
          className="absolute w-4 h-4 bg-white border border-gray-500 rounded-full"
          style={{ ...pos }}
        />
      ))}
    </div>
  );
}