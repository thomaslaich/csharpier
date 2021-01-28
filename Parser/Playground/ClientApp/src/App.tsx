import React, { Component } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/clike/clike";
import styled from "styled-components";

interface State {
    enteredCode: string;
    formattedCode: string;
}

export class App extends Component<{}, State> {
    constructor(props: {}) {
        super(props);
        this.state = {
            enteredCode: `public class ClassName
{
    public void MethodName() { }
}`,
            formattedCode: "",
        };
    }

    componentDidMount() {
        this.formatCode();
    }
    
    async formatCode() {
        const response = await fetch("/Format", {
            method: "POST",
            body: JSON.stringify(this.state.enteredCode),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const data = await response.text();
        this.setState({
            formattedCode: data,
        })
    }

    render() {
        const options = {
            lineNumbers: true,
            matchBrackets: true,
            mode: "text/x-java",
        };

        return (
            <WrapperStyle>
                <Header>CSharpier</Header>
                <CodeWrapperStyle>
                    <EnteredCodeStyle>
                        <CodeMirror
                            value={this.state.enteredCode}
                            options={options}
                            onBeforeChange={(editor, data, value) => {
                                this.setState({enteredCode: value});
                            }}
                            onChange={() => {
                                this.formatCode();
                            }}
                        />
                    </EnteredCodeStyle>
                    <EnteredCodeStyle>
                        <CodeMirror
                            value={this.state.formattedCode}
                            options={{...options, readOnly: true}}
                            onBeforeChange={() => {}}
                            onChange={() => {}}
                        />
                    </EnteredCodeStyle>
                </CodeWrapperStyle>
                <Footer/>
            </WrapperStyle>
        );
    }
}

const EnteredCodeStyle = styled.div`
    width: 50%;
    height: 100%;

    .react-codemirror2,
    .CodeMirror {
        height: 100%;
    }
`;

const WrapperStyle = styled.div`
    height: 100%;
`;

const CodeWrapperStyle = styled.div`
    display: flex;
    width: 100%;
    height: calc(100vh - 80px);
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
`;

const Header = styled.div`
    height: 60px;
    background-color: #f7f7f7;
    display: flex;
    align-items: center;
    padding-left: 28px;
    font-size: 22px;
    font-style: italic;
`;

const Footer = styled.div`
    height: 20px;
`;
