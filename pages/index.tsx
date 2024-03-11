import { useState } from "react";
import Layout from "../components/Layout";
import { DataPoint, LagrangePolynomial } from "../interfaces";

const IndexPage: React.FC = () => {
  const [resultadoResolver, setResultadoResolver] = useState("");
  const [resultadoInterpolador, setResultadoInterpolador] = useState("");

  // Quando apertar o botão resolver para resolver y em função de x
  const handleResolverSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);

    const query = new URLSearchParams(formData as any).toString();

    // Envia os dados para resolução e mostra o resultado quando receber
    try {
      fetch(`/api/lagrange?${query}`)
        .then((response) => response.json())
        .then((data) => setResultadoResolver(`Para x = ${data.wishedX}, y = ${data.wishedY}`));
    } catch (error) {
      console.error(error);
      setResultadoResolver("Erro ao resolver o polinômio");
    }
  }

  // Quando apertar o botão resolver para descobrir a função interpoladora
  const handleInterpoladorSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);

    const body: DataPoint[] = [
      {
        x: Number(formData.get("x1")),
        y: Number(formData.get("y1"))
      },
      {
        x: Number(formData.get("x2")),
        y: Number(formData.get("x2"))
      },
      {
        x: Number(formData.get("x3")),
        y: Number(formData.get("y3"))
      },
    ]

    // Envia os dados para resolução e mostra o resultado quando receber
    try {
      fetch(`/api/lagrange/`, {
        method: "POST",
        body: JSON.stringify(body)
      })
        .then((response) => response.json())
        .then((data: LagrangePolynomial) => setResultadoInterpolador(`
          A função que interliga os pontos é: ${data.polynomialString}
        `) );
    } catch (error) {
      console.error(error);
      setResultadoInterpolador("Erro ao interpolar o polinômio");
    }
  }

  return (
    <Layout title="Resolver | Lagrange">
      <h2>Descobrir y em função de x</h2>
      <form onSubmit={handleResolverSubmit}>
        <label htmlFor="polynomialString">Insira o polinômio:</label>
        <input type="text" name="polynomialString"></input>
        <br />
        <label htmlFor="wishedX">Insira o valor de x:</label>
        <input type="text" name="wishedX"></input>
        <br />
        <button>Resolver</button>
      </form>
      <br />
      <h3 id="resultadoResolver">{resultadoResolver}</h3>
      <br />
      <hr />

      <h2>Descobrir função interpoladora</h2>
      <form onSubmit={handleInterpoladorSubmit}>
        <label htmlFor="x1">x1:</label>
        <input type="number" name="x1"></input>
        <label htmlFor="y1">y1:</label>
        <input type="number" name="y1"></input>
        <br />
        <label htmlFor="x2">x2:</label>
        <input type="number" name="x2"></input>
        <label htmlFor="y2">y2:</label>
        <input type="number" name="y2"></input>
        <br />
        <label htmlFor="x3">x3:</label>
        <input type="number" name="x3"></input>
        <label htmlFor="y3">y3:</label>
        <input type="number" name="y3"></input>
        <br />
        <button>Resolver</button>
      </form>
      <br />
      <h3 id="resultadoInterpolador">{resultadoInterpolador}</h3>
      <br />
      
    </Layout>
  );
};

export default IndexPage;
