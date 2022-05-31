import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

import styled from "styled-components";
import InputDefault from "../../Components/Form/InputDefault";
import Label from "../../Components/Form/LabelDefault";

import { userInfo } from "../../mockup/userInfo";
import { Headline2, SubTitle1, SubTitle2 } from "../../mixin";

const Wrapper = styled.div`
  height: 80vh;
  overflow: hidden;
`;

const Title = styled.h2`
  ${Headline2};
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  justify-content: center;
  align-items: center;
  height: 50vh;
  width: 38rem;
  margin: 0 auto;
  form {
    height: inherit;
    display: flex;
    position: relative;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    label.error-label {
      font-size: 1.8rem;
      color: ${(props) => props.theme.color.error700};
    }
  }
`;

const LoginLabel = styled(Label)`
  ${SubTitle2}
`;

const LoginInput = styled(InputDefault)`
  ${SubTitle1}
  border:0;
  outline: unset;
`;

const ActionContainer = styled.div`
  display: flex;
  width: inherit;
  justify-content: space-between;
  align-items: center;
  a {
    font-size: 1.5rem;
  }
  button {
    cursor: pointer;
    padding: 0.7rem 2rem;
    border: 0;
    font-size: 2.8rem;
    color: ${(props) => props.theme.color.fontColorWhite};
    border-radius: 0.3rem;
    line-height: 2.8rem;
    background-color: ${(props) => props.theme.color.primary600};
  }
`;

interface IUserProps {
  email: string;
  password: string;
  loginFail: string;
}

const AdminMain = () => {
  const [isLogin, setLogin] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<IUserProps>();

  const onSubmit = handleSubmit(async (data: IUserProps) => {
    const [user] = userInfo.filter((value) => value.email === data.email);
    if (data.email !== user.email) {
      setError("loginFail", { message: "이메일 또는 비밀번호가 다릅니다." });
      return;
    }

    if (data.password !== user.password) {
      setError("loginFail", { message: "이메일 또는 비밀번호가 다릅니다." });
      return;
    }

    setError("loginFail", { message: "" });
    setLogin(true);
    setLoading(true);
  });

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    let loading = setTimeout(() => navigate("/admin/1/menu"), 3000);

    return () => clearTimeout(loading);
  }, [isLoading]);

  return !isLogin ? (
    <Wrapper>
      <Title>관리자 로그인 화면</Title>
      <FormContainer>
        <form onSubmit={onSubmit}>
          <LoginLabel htmlFor="email">이메일</LoginLabel>
          <LoginInput
            id="email"
            name="email"
            placeholder="이메일을 입력해주세요."
            type="email"
            register={register}
            registerOptions={{
              required: "아이디를 입력해주세요.",
              pattern: {
                value:
                  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: "이메일이 아닙니다.",
              },
            }}
            error={errors.email?.message}
          />
          <LoginLabel htmlFor="password">비밀번호</LoginLabel>
          <LoginInput
            id="password"
            name="password"
            type="password"
            placeholder="비밀번호를 입력해주세요."
            typeof="password"
            register={register}
            registerOptions={{
              required: "비밀번호를 입력해주세요.",
            }}
            error={errors.password?.message}
          />
          {errors?.loginFail?.message && (
            <Label className="error-label">{errors?.loginFail?.message}</Label>
          )}
          <ActionContainer>
            <Link to="#">아이디 또는 비밀번호를 잃어버리셨나요?</Link>
            <button onClick={onSubmit}>로그인</button>
          </ActionContainer>
        </form>
      </FormContainer>
    </Wrapper>
  ) : (
    <h1>로그인 중입니다.</h1>
  );
};

export default AdminMain;
