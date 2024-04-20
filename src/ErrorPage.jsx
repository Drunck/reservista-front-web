import { Link, useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="container text-center">
        <main>
            <p className="m-0 p-0" style={{fontSize: "192px", fontWeight: "900"}}>Oops!</p> 
            <p className="" style={{fontSize: "24px", fontWeight: "400"}}>{error.status} - {error.statusText || error.message}</p>
            <Link className="text-decor-none" to="/">
                <p className="btn-primary text-center m-auto" style={{width: "208px"}}>Go to Homepage</p>
            </Link>  
        </main>
    </div>
  );
}