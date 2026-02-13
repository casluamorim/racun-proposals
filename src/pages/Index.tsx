import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center gradient-primary px-4">
      <div className="text-center text-primary-foreground">
        <h1 className="font-display text-5xl md:text-7xl font-bold mb-4">Racun</h1>
        <p className="text-lg md:text-xl opacity-70 mb-8">Agência de Marketing Digital</p>
        <Link
          to="/admin"
          className="inline-block bg-primary-foreground text-primary px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
        >
          Acessar Painel
        </Link>
      </div>
    </div>
  );
};

export default Index;
