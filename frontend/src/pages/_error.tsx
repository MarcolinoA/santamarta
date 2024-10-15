import { NextPage, NextPageContext } from 'next';

interface ErrorProps {
  statusCode?: number;
}

const ErrorPage: NextPage<ErrorProps> = ({ statusCode }) => {
  return (
    <p>
      {statusCode
        ? `An error ${statusCode} occurred on the server`
        : 'An error occurred on the client'}
    </p>
  );
};

ErrorPage.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default ErrorPage;
