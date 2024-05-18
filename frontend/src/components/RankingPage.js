import { useState, useEffect, useMemo } from 'react';
import { Container, Table, Pagination, Spinner } from 'react-bootstrap';
import '../styles/RankingPage.css';
import * as routes from '../config/routes';
import axios from 'axios';
import { useToast } from './ToastProvider';

function sortByPoints(rankings) {
  return rankings.sort((a, b) => b.points - a.points);
}

function Ranking() {
  const [rankings, setRankings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const showToast = useToast();
  const itemsPerPage = 10;

  useEffect(() => {
    axios.get(routes.GET_RANKING).then((res) => {
      setRankings(sortByPoints(res.data));
      setLoading(false);
    }).catch((err) => {
      showToast(err.message, "danger");
      setLoading(false);
    })
  }, [showToast]);

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return rankings.slice(start, start + itemsPerPage);
  }, [currentPage, rankings]);

  const totalPages = Math.ceil(rankings.length / itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Container className="ranking-container">
      <h1 className="text-center my-4">Ranking</h1>
      {loading ? (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <>
          <Table striped bordered hover variant="dark" className="ranking-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Username</th>
                <th>Points</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((user, index) => (
                <tr key={index}>
                  <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                  <td>{user.username}</td>
                  <td>{user.points}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination className="justify-content-center">
            <Pagination.First onClick={() => handlePageChange(1)} disabled={currentPage === 1} />
            <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
            {[...Array(totalPages).keys()].map(page => (
              <Pagination.Item
                key={page + 1}
                active={page + 1 === currentPage}
                onClick={() => handlePageChange(page + 1)}
              >
                {page + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
            <Pagination.Last onClick={() => handlePageChange(totalPages)} disabled={currentPage === totalPages} />
          </Pagination>
        </>
    )}
    </Container>   
  );
}

export default Ranking;
