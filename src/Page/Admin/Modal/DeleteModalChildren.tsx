import React, { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { ProductListValues } from "../../../mockup/productList";
import {
  productListState,
  selectOptionState,
  selectProductListState,
  Option,
} from "../../../state/productItemState";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  height: 100%;
  ul {
    margin-top: 1.5rem;
    li {
      display: flex;
      align-items: center;
      line-height: 1.6;
      label {
        margin-left: 0.5rem;
        font-size: 1.7rem;
      }
    }
  }
  div {
    display: flex;
    justify-items: flex-end;
    align-self: flex-end;
    button {
      cursor: pointer;
      font-size: 2rem;
      border: 0;
      padding: 0.8rem 1.3rem;
      border-radius: 0.5rem;
      color: ${(props) => props.theme.color.fontColorWhite};
      &:nth-child(1) {
        background-color: ${(props) => props.theme.color.gray300};
      }

      &:nth-child(2) {
        background-color: ${(props) => props.theme.color.error500};
      }

      &:not(:first-child) {
        margin-left: 0.8rem;
      }
    }
  }
`;

const SelectContainer: React.FC<{ select: boolean | undefined }> = styled.span<{
  select: boolean;
}>`
  background-color: ${(props) =>
    props.select
      ? props.theme.color.error500
      : props.theme.color.background100};
  width: 1.2rem;
  height: 1.2rem;
  border: 3px solid ${(props) => props.theme.color.gray200};
  border-radius: 50%;
`;

interface IDeleteModalChildrenProps<T> {
  setModal: React.Dispatch<React.SetStateAction<boolean>>;
  items?: Array<T>;
}

const DeleteModalChildren = ({
  setModal,
  items,
}: IDeleteModalChildrenProps<ProductListValues>) => {
  const setSelectOption = useSetRecoilState(selectOptionState);
  const [selectList, setSelectList] = useRecoilState<ProductListValues[]>(
    selectProductListState,
  );
  const [productList, setProductList] = useRecoilState(productListState);

  const handleModal = () => {
    setSelectList([]);
    setProductList((preValue) => [
      ...preValue.map((value) => ({ ...value, select: false })),
    ]);
    setModal(false);
    setSelectOption({ options: Option.NONE });
  };

  const selectDeleteItemsSubmitHandler = () => {
    const compare = (a: { id: number }, b: { id: number }) => a.id === b.id;

    const newProductList = productList.filter(
      (product) =>
        !selectList
          .filter((value) => value.select === true)
          .some((deleteProduct) => compare(product, deleteProduct)),
    );

    setProductList(newProductList);
    setModal(false);
    setSelectList([]);
    setSelectOption({ options: Option.NONE });
  };

  const checkBoxChangeHandler = (event: React.MouseEvent<HTMLElement>) => {
    let id = event.currentTarget.dataset.id;

    setSelectList((prevState) =>
      prevState.map((value) => {
        if (value.id !== Number(id)) {
          return value;
        }
        return { ...value, select: !value.select };
      }),
    );
  };

  useEffect(() => {
    if (items) {
      setSelectList(items.map((value) => ({ ...value, select: true })));
    }
  }, []);

  return (
    <>
      <h1>삭제하기</h1>
      <p>상품을 삭제하면 복구할 수 없습니다.</p>
      <Wrapper>
        <ul>
          {selectList?.map((item) => (
            <li key={item.id} data-id={item.id} onClick={checkBoxChangeHandler}>
              <SelectContainer select={item.select} />
              <label htmlFor={`${item.id}`}>{item.name}</label>
            </li>
          ))}
        </ul>
        <div>
          <button onClick={handleModal}>돌아가기</button>
          <button onClick={selectDeleteItemsSubmitHandler}>삭제하기</button>
        </div>
      </Wrapper>
    </>
  );
};

export default DeleteModalChildren;
