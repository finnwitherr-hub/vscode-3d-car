import * as vscode from 'vscode';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand('vscode-3d-car.openCar', () => {
    const panel = vscode.window.createWebviewPanel(
      'carViewer',
      '3D Car Viewer',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        localResourceRoots: [vscode.Uri.file(path.join(context.extensionPath, 'media'))]
      }
    );

    const scriptPath = vscode.Uri.file(
      path.join(context.extensionPath, 'media', 'three.min.js')
    ).with({ scheme: 'vscode-resource' });

    const carScriptPath = vscode.Uri.file(
      path.join(context.extensionPath, 'media', 'car.js')
    ).with({ scheme: 'vscode-resource' });

    panel.webview.html = getWebviewContent(scriptPath, carScriptPath);
  });

  context.subscriptions.push(disposable);
}

function getWebviewContent(scriptPath: vscode.Uri, carScriptPath: vscode.Uri) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>3D Car Viewer</title>
      <style>
        body {
          margin: 0;
          overflow: hidden;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          font-family: Arial, sans-serif;
        }
        #canvas {
          display: block;
          width: 100%;
          height: 100vh;
        }
        #info {
          position: absolute;
          top: 20px;
          left: 20px;
          color: white;
          background: rgba(0, 0, 0, 0.5);
          padding: 20px;
          border-radius: 8px;
          font-size: 14px;
        }
        #controls {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          color: white;
          background: rgba(0, 0, 0, 0.5);
          padding: 15px 25px;
          border-radius: 8px;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <canvas id="canvas"></canvas>
      <div id="info">
        <h2>🚗 3D Car Viewer</h2>
        <p>Drag to rotate | Scroll to zoom</p>
      </div>
      <div id="controls">
        <p>↑ ↓ ← → to move | SPACE to jump</p>
      </div>
      <script src="${scriptPath}"></script>
      <script src="${carScriptPath}"></script>
    </body>
    </html>
  `;
}

export function deactivate() {}
