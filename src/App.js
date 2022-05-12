import "./App.css";
import axios from "axios";
import { React, useState, useEffect, useMemo } from "react";
import debounce from "lodash.debounce";
import API from "../src/util/api";
import {
  Button,
  FormControl,
  InputGroup,
  Container,
  Row,
  Col,
} from "react-bootstrap";

import CustomCard from "./CustomCard";

function App() {
  const [query, setQuery] = useState("");
  const [animeList, setAnimeList] = useState([]);
  const [limit, setLimit] = useState(16);
  const [pageNo, setPageNo] = useState(1);
  const [message, setMessage] = useState("");
  let uid = 0;

  useEffect(() => {
    loadMoreHandler();
  }, [pageNo]);

  const clickHandler = async () => {
    setMessage("");
    setPageNo(1);
    setAnimeList([]);

    query &&
      (await API.get("", { params: { q: query, limit: limit, page: pageNo } })
        .then(function (response) {
          let newList = response.data.results;
          setAnimeList(newList);
          if (newList.length === 0) {
            console.log(newList.length);
            setMessage(`No records found for query : ${query}`);
          }
        })

        .catch(function (error) {
          setMessage(`No records found for query : ${query}`);
          console.log(error);
        }));
  };

  const loadMoreHandler = async () => {
    query &&
      (await API.get("", { params: { q: query, limit: limit, page: pageNo } })
        .then(function (response) {
          let newList = response.data.results;
          setAnimeList([...animeList, ...newList]);
        })

        .catch(function (error) {
          console.log(error);
        }));
  };

  const debouncedResults = useMemo(() => {
    return debounce(loadMoreHandler, 100);
  }, []);

  useEffect(() => {
    return () => {
      debouncedResults.cancel();
    };
  });
  return (
    <div className="App">
      <Container className="fixed-top">
        <Row className="py-4 mx-auto justify-content-center">
          <Col xs={6}>
            <InputGroup className="mb-3 justify-content-center">
              <FormControl
                xs={10}
                className="bg-primary text-white py-3 border-light"
                placeholder="Search"
                style={{
                  color: "white",
                  borderRight: "none",
                  borderRadius: "8px 0px 0px 8px",
                }}
                onChange={(e) => {
                  setQuery(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    clickHandler();
                  }
                }}
              />
              <Button
                variant="primary"
                className="border-light"
                style={{
                  borderLeft: "none",
                  borderRadius: "0px 8px 8px 0px",
                }}
                id="button-addon2"
                onClick={clickHandler}
              >
                Go
              </Button>
            </InputGroup>

            <div className="py-2 text-light text-center mx-auto px-4">
              <h6 style={{ color: "whitesmoke" }}>
                {" "}
                Requesting : https://api.jikan.moe/v3/search/anime?q={query}
              </h6>
            </div>
          </Col>
        </Row>
      </Container>

      <Container className="">
        <div className="my-4 py-4">{message}</div>
        <div className="my-4 py-4"></div>
        {animeList.length > 0 && (
          <div>
            <Row xs={2} md={4} className="g-4  mx-4 py-4">
              {animeList.map((anime, index) => (
                <CustomCard
                  key={index}
                  colKey={index + "animeList"}
                  cardKey={anime.members + anime.rated}
                  src={anime.image_url}
                  title={anime.title}
                />
              ))}
            </Row>
            <h5
              className="text-white change-cursor"
              onClick={() => {
                setPageNo(pageNo + 1);
              }}
            >
              {" "}
              Load More ...
            </h5>
          </div>
        )}
      </Container>
    </div>
  );
}

export default App;
