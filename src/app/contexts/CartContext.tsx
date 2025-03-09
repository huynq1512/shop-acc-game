import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number | string;
  quantity: number;
  image?: string;
}

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  addItem: (item: CartItem) => void;
  updateItem: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  console.log(items);

  // ✅ Load cart from localStorage on first render
  useEffect(() => {
    const storedItems = localStorage.getItem("cartItems");
    if (storedItems) {
      const parsedItems: CartItem[] = JSON.parse(storedItems);
      setItems(parsedItems);
    }
  }, []);

  // ✅ Save cart to localStorage whenever it changes
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem("cartItems", JSON.stringify(items));
    } else {
      localStorage.removeItem("cartItems"); // Xóa nếu giỏ hàng trống
    }

    const total = items.reduce((sum, item) => sum + item.quantity, 0);
    setTotalItems(total);
    localStorage.setItem("totalItems", total.toString());
  }, [items]);

  const addItem = (newItem: CartItem) => {
    console.log(items);

    // setItems((prevItems) => {
    //   const existingItemIndex = prevItems.findIndex(
    //     (item) => item.id === newItem.id
    //   );

    //   if (existingItemIndex !== -1) {
    //     // Nếu sản phẩm đã tồn tại, chỉ tăng thêm 1 đơn vị
    //     const updatedItems = [...prevItems];
    //     updatedItems[existingItemIndex].quantity += 1;
    //     return updatedItems;
    //   } else {
    //     console.log("dsfsd");

    //     // Nếu chưa có, thêm mới vào giỏ hàng với số lượng mặc định là 1
    //     return [...prevItems, { ...newItem, quantity: 1 }];
    //   }
    // });
  };

  const updateItem = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setItems([]);
    setTotalItems(0);
    localStorage.removeItem("cartItems");
    localStorage.removeItem("totalItems");
  };

  const value: CartContextType = {
    items,
    totalItems,
    addItem,
    updateItem,
    removeItem,
    clearCart
  };
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
