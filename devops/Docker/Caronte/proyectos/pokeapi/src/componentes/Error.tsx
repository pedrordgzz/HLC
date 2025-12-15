export const Error = () => {
  return (
    <div className="error-container">
      <h2>Algo ha salido mal, verifique su conexión a Internet o intentelo más tarde</h2>
      <img 
        src="https://http.cat/404" 
        alt="Error 404" 
        width="300" 
      />
    </div>
  );
};