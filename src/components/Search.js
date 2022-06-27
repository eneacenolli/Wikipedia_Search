import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SearchStyle.css";

const Search = () => {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noResults, setnoResults] = useState(false);

  useEffect(() => {
    const search = async () => {
      setLoading(true);
      const { data } = await axios.get("https://en.wikipedia.org/w/api.php", {
        params: {
          action: "query",
          list: "search",
          format: "json",
          origin: "*",
          srsearch: term,
        },
      });

      setnoResults(!data.query.search.length);

      setLoading(false);

      setResults(data.query.search.splice(0, 5));
    };

    const timeout = setTimeout(() => {
      if (term.length > 3) {
        search();
      }
    }, 500);

    return () => {
      clearTimeout(timeout);
    };
  }, [term]);

  const renderdResults = results.map((result) => {
    return (
      <div key={result.pageid} className="item">
        <div className="right floated content">
          <a
            className="ui button"
            target="_blank"
            href={`https://en.wikipedia.org?curid=${result.pageid}`}
          >
            Go
          </a>
        </div>
        <div className="content">
          <div className="header">
            <h2>{result.title}</h2>
          </div>
          <span dangerouslySetInnerHTML={{ __html: result.snippet }}></span>
        </div>
      </div>
    );
  });

  return (
    <div className="contanier">
      <div className="ui form">
        <div className="field">
          <h1 className="enterSearch">Enter Search Term</h1>

          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            className="input"
          />
        </div>

        {loading && <div id="loading"></div>}
      </div>

      <div className="ui called list">
        <h3 className="noResults">
          {noResults
            ? "No Results Found. Please Search again..."
            : renderdResults}
        </h3>
      </div>
    </div>
  );
};

export default Search;
