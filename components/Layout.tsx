import React, { ReactNode } from "react";

type Props = {
  children?: ReactNode;
  title?: string;
};

const Layout = ({ children, title = "Interpolação de Lagrange" }: Props) => (
  <div>
    {children}
  </div>
);

export default Layout;
