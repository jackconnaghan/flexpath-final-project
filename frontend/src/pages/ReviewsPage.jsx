import React from "react";

export default function ReviewsPage() {

    const [curComp, setCurComp] = useState(false);

    function handleCompChange() {
        setCurComp(!curComp);
    }

    return (
        <div className="extend-under-navbar search-just">
        {curComp ? 
        <MyReviewsComponent />
        : 
        <WorldReviewsComponent />}
        </div>
    )
}