import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { selectMenuListState } from "../../state/productItemState";
import { IOrderSelectedItem } from "./ClientMenu";
import Modal from "../../Components/Modals/Modal";
import styled from "styled-components";
import { Headline1 } from "../../mixin";
import OrderStateBar from "./OrderStateBar";
import PaymentModalChildren from "./Modal/PaymentModalChildren";

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 5rem;
  h1 {
    ${Headline1}
  }
  button {
    cursor: pointer;
    padding: 0.5rem 2rem;
    border: 0;
    font-size: 2.8rem;
    color: ${(props) => props.theme.color.fontColorWhite};
    border-radius: 0.3rem;
    background-color: ${(props) => props.theme.color.gray300};
  }
`;

const MenuListItem = styled.div`
  border-bottom: 1px solid black;
  width: 100%;
  padding-bottom: 1rem;
  h2 {
    font-size: 2rem;
    font-weight: bold;
    padding: 1.3rem 0 0.8rem 0;
  }
  p {
    font-size: 1.5rem;
    padding: 0.3rem 0;
  }
`;

const ClientSelectList = () => {
  // 주문 목록 리스트
  const [totalSelectMenu, setTotalSelectMenu] =
    useRecoilState(selectMenuListState);

  // 주문 수량 변경
  const [count, setCount] = useState(0);

  console.log(totalSelectMenu);
  const [isModal, setIsModal] = useState(false);

  // for Order State bar handler
  const handlePayment = () => {
    setIsModal(true);
  };

  const handleAddCount = (current: IOrderSelectedItem) => {
    let [selected] = totalSelectMenu.filter((menu) => menu.id === current.id);
    setTotalSelectMenu((item) =>
      [
        ...item.filter((el) => el !== selected),
        { ...selected, totalCount: selected.totalCount + 1 },
      ].sort((a, b) => (a.id > b.id ? 1 : -1))
    );
  };

  return (
    <>
      {isModal && (
        <Modal strach={true}>
          <PaymentModalChildren />
        </Modal>
      )}
      <Header>
        <h1>주문 목록</h1>
      </Header>

      {totalSelectMenu.map((item) => (
        <MenuListItem key={item.id}>
          <h2>{item.name}</h2>
          <p>
            주문수량:
            <button>-</button>
            {item.totalCount}
            <button onClick={() => handleAddCount(item)}>+</button>
          </p>
          <p>총 가격: {item.totalPrice}</p>
          {item.option && <p>{item.option}</p>}
        </MenuListItem>
      ))}

      <OrderStateBar
        totalCount={totalSelectMenu.reduce(function (acc, obj) {
          return acc + obj.totalCount;
        }, 0)}
        totalPrice={totalSelectMenu.reduce(function (acc, obj) {
          return acc + obj.totalPrice;
        }, 0)}
        label="주문하기"
        handler={handlePayment}
      />
    </>
  );
};

export default ClientSelectList;
