import { useState } from "react";
import Layout from "../components/Layout";

const IndexPage: React.FC = () => {
  const [resultado, setResultado] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);

    const query = new URLSearchParams(formData as any).toString();

    try {
      fetch(`/api/lagrange?${query}`)
        .then((response) => response.json())
        .then((data) => setResultado(`Para x = ${data.wishedX}, y = ${data.wishedY}`));
    } catch (error) {
      console.error(error);
      setResultado("Erro ao resolver o polinômio");
    }
  }

  return (
    <Layout title="Resolver | Lagrange">
      <form onSubmit={handleSubmit}>
        <label htmlFor="polynomialString">Insira o polinômio:</label>
        <input type="text" name="polynomialString"></input>
        <br />
        <label htmlFor="wishedX">Insira o valor de x:</label>
        <input type="text" name="wishedX"></input>
        <br />
        <button>Resolver</button>
      </form>
      <br />
      <div id="resultado">{resultado}</div>

    </Layout>
  );
};

export default IndexPage;
