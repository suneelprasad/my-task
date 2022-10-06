import React, { useEffect, useState } from "react";
import "./App.css";
import SearchBar from "material-ui-search-bar";
import axios from "axios";

const endurl = "https://api.github.com/graphql";

function App() {
  const [topic, setTopic] = useState("react");
  const [response, setResponse] = React.useState([]);
  console.log(response);
  const handleChange = (topic) => {
    setTopic(topic);
  };
  const cancelSearch = () => {
    setTopic("");
  };

  useEffect(() => {
    // calll api here and set response
    async function fetchData(topic) {
      const response = await axios({
        url: endurl,
        data: {
          query: `
{
  topic(name: "${topic}") {
    id
    name
    stargazers{
        totalCount
    }
    relatedTopics{
        id 
        name
        stargazers{
            totalCount
        }

    }
  }
}

`,
        },
        method: "POST",
        headers: {
          Authorization: "Bearer " + process.env.REACT_APP_ACCESS_KEY,
        },
      })
        .then((response) =>
          setResponse(response?.data?.data?.topic.relatedTopics)
        )
        .catch((err) => {
          console.log(err);
          return err;
        });
    }
    fetchData(topic);
  }, [topic]);

  return (
    <div className="App">
      <header className="App-header">
        <h2>Assignment</h2>
      </header>
      <div className="App-body">
        <SearchBar
          placeholder="Search Here"
          className="search-bar"
          value={topic}
          onRequestSearch={(e) => handleChange(e)}
          onCancelSearch={() => cancelSearch()}
        />
      </div>
      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>Topic Name</th>
              <th>Stargazers Count</th>
            </tr>
          </thead>
          <tbody>
            {response.map((el, index) => (
              <>
                <tr>
                  <td>
                    <div key={index} onClick={() => handleChange(el.name)}>
                      {el.name}
                    </div>
                  </td>
                  <td>
                    <div key={index}>{el.stargazers.totalCount}</div>
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
