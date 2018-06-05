// Parse the search string to get url parameters.
var search = window.location.search;
var parameters = {};
search.substr(1).split('&').forEach(function (entry) {
    var eq = entry.indexOf('=');
    if (eq >= 0) {
        parameters[decodeURIComponent(entry.slice(0, eq))] =
            decodeURIComponent(entry.slice(eq + 1));
    }
});

// if variables was provided, try to format it.
if (parameters.variables) {
    try {
        parameters.variables =
            JSON.stringify(JSON.parse(parameters.variables), null, 2);
    } catch (e) {
        // Do nothing, we want to display the invalid JSON as a string, rather
        // than present an error.
    }
}

// When the query and variables string is edited, update the URL bar so
// that it can be easily shared
function onEditQuery(newQuery) {
    parameters.query = newQuery;
    updateURL();
}

function onEditVariables(newVariables) {
    parameters.variables = newVariables;
    updateURL();
}

function onEditOperationName(newOperationName) {
    parameters.operationName = newOperationName;
    updateURL();
}

function updateURL() {
    var newSearch = '?' + Object.keys(parameters).filter(function (key) {
        return Boolean(parameters[key]);
    }).map(function (key) {
        return encodeURIComponent(key) + '=' +
        encodeURIComponent(parameters[key]);
    }).join('&');
    history.replaceState(null, null, newSearch);
}

function graphQLFetcher(graphQLParams) {
    return fetch('/graphql', {
        method: 'post',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(graphQLParams),
    }).then(function (response) {
        return response.text();
    }).then(function (responseBody) {
        try {
            return JSON.parse(responseBody);
        } catch (error) {
            return responseBody;
        }
    });
}

class ExtendedGraphiQL extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // REQUIRED:
            // `fetcher` must be provided in order for GraphiQL to operate
            fetcher: this.props.fetcher,

            // OPTIONAL PARAMETERS
            // GraphQL artifacts
            query: '',
            variables: '',
            response: '',

            // GraphQL Schema
            // If `undefined` is provided, an introspection query is executed
            // using the fetcher.
            schema: undefined,

            // Useful to determine which operation to run
            // when there are multiple of them.
            operationName: null,
            storage: null,
            defaultQuery: null,

            // Custom Event Handlers
            onEditQuery: null,
            onEditVariables: null,
            onEditOperationName: null,

            // GraphiQL automatically fills in leaf nodes when the query
            // does not provide them. Change this if your GraphQL Definitions
            // should behave differently than what's defined here:
            // (https://github.com/graphql/graphiql/blob/master/src/utility/fillLeafs.js#L75)
            getDefaultFieldNames: null
        };
    }
  
    handlePrettifyQuery(event) {
        this.graphiql.handlePrettifyQuery(event);
    }

    handleToggleHistory(event) {
        this.graphiql.handleToggleHistory(event);
    }

    render() {
        return (
            <GraphiQL ref={c => { this.graphiql = c; }} {...this.state}>
                <GraphiQL.Logo>
                    IndraDB
                </GraphiQL.Logo>
                <GraphiQL.Toolbar>
                    <GraphiQL.ToolbarButton
                        onClick={this.handlePrettifyQuery.bind(this)}
                        title="Prettify Query (Shift-Ctrl-P)"
                        label="Prettify" />
                    <GraphiQL.ToolbarButton
                        onClick={this.handleToggleHistory.bind(this)}
                        title="Show History"
                        label="History" />
                </GraphiQL.Toolbar>
            </GraphiQL>
        );
    }
}

const root = (
    <ExtendedGraphiQL
        fetcher={graphQLFetcher}
        query={parameters.query}
        variables={parameters.variables}
        operationName={parameters.operationName}
        onEditQuery={onEditQuery}
        onEditVariables={onEditVariables}
        onEditOperationName={onEditOperationName} />
);

ReactDOM.render(root, document.getElementById('graphiql'));
