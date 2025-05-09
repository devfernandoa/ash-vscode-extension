const vscode = require('vscode');
const cp = require('child_process');

function activate(context) {
    console.log("Ash linter activated");
    const diagnostics = vscode.languages.createDiagnosticCollection("ash");

    vscode.workspace.onDidSaveTextDocument((document) => {
        if (document.languageId !== "ash") return;

        const config = vscode.workspace.getConfiguration("ash");
        const ashPath = config.get("path", "ash");

        const proc = cp.spawn(ashPath, [], { shell: true });


        let stderr = "";
        let stdout = "";

        proc.stderr.on("data", (chunk) => {
            stderr += chunk.toString();
        });

        proc.stdout.on("data", (chunk) => {
            stdout += chunk.toString();
        });

        proc.on("close", (code) => {
            const output = (stderr + stdout).trim();
            console.log("Ash Linter received output:", output);

            const fileDiagnostics = [];

            if (output.toLowerCase().includes("error")) {
                let token = null;
                let line = 0;

                // Extract text inside single quotes
                const tokenStart = output.indexOf("'");
                const tokenEnd = output.indexOf("'", tokenStart + 1);
                if (tokenStart !== -1 && tokenEnd !== -1) {
                    token = output.substring(tokenStart + 1, tokenEnd);
                }

                // Extract last number in the string (assumed to be the line number)
                const parts = output.trim().split(" ");
                for (let i = parts.length - 1; i >= 0; i--) {
                    const maybeNum = parseInt(parts[i], 10);
                    if (!isNaN(maybeNum)) {
                        line = maybeNum - 1;
                        break;
                    }
                }

                // Try to find the token on that line
                const docLine = document.lineAt(line).text;
                const start = docLine.indexOf(token);
                const end = start + (token ? token.length : 1);

                // Create a fallback if not found
                const range = (start >= 0)
                    ? new vscode.Range(line, start, line, end)
                    : new vscode.Range(line, 0, line, 80);

                // Push the diagnostic
                fileDiagnostics.push(new vscode.Diagnostic(
                    range,
                    output,
                    vscode.DiagnosticSeverity.Error
                ));
            }

            diagnostics.set(document.uri, fileDiagnostics); // ✅ always set!
        });


        proc.stdin.write(document.getText());
        proc.stdin.end();
    });

    context.subscriptions.push(diagnostics);
}

function deactivate() { }

module.exports = {
    activate,
    deactivate
};
