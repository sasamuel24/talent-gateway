import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/Layout";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <Layout>
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-xs font-heading font-bold uppercase tracking-brand text-primary mb-2">
            Error 404
          </p>
          <h1 className="text-4xl font-heading font-extrabold uppercase tracking-brand text-foreground mb-3">
            Página no encontrada
          </h1>
          <p className="text-sm text-muted-foreground font-body mb-6">
            La página que buscas no existe o fue movida.
          </p>
          <Link
            to="/"
            className="inline-flex items-center px-6 py-2.5 bg-primary text-white text-xs font-heading font-bold uppercase tracking-brand rounded-full hover:bg-primary/90 transition-colors"
          >
            Ver vacantes
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
