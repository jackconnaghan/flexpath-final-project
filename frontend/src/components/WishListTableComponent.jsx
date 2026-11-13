import React, { useState } from "react";
import { useWishListStore } from "../stores/useWishListStore";



export default function WishListTableComponent() {

const lists = useWishListStore((s) => s.userLists[username]);
const addList = useWishListStore((s) => s.addList);
const removeList = useWishListStore((s) => s.removeList);

useEffect(() => {
    
})
}