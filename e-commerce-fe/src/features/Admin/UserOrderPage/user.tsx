import React from "react";

function User({ user }: any) {
  return (
    <div>
      Users
      <div className="bg-[#e6f8ff] p-10 mt-2 flex flex-col gap-4">
        <h1>
          Name: <span>{user?.firstName + user?.lastName}</span>
        </h1>
        <h1>
          Contact: <span>{user?.phone}</span>
        </h1>
        <h1>
          Order State: <span>{user?.state}</span>
        </h1>
        <h1>
          Order Disctrice: <span>{user?.district}</span>
        </h1>
        <h1>
          Order Location: <span>{user?.location}</span>
        </h1>
      </div>
    </div>
  );
}

export default User;
