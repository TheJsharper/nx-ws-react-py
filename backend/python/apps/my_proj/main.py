from  fastapi import FastAPI, Request, Response, WebSocket, WebSocketDisconnect
from fastapi.responses import HTMLResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from openai import AsyncOpenAI
from  websockets.exceptions import ConnectionClosed
from httpx import RequestError
import httpx 
import random

import uvicorn
app = FastAPI()
ENDPOINT = "http://127.0.0.1:39281/v1"
MODEL = "llama3.2:1b"
# Health check for the endpoint
try:
    response = httpx.get(f"{ENDPOINT}.client.chat.completions")
    if response.status_code == 200:
        print(f"Server at {ENDPOINT} is healthy.")
    else:
        print(f"Server at {ENDPOINT} is not healthy. Status code: {response.status_code}")
except Exception as e:
    print(f"Error connecting to server: {e}")
client = AsyncOpenAI(
    base_url=ENDPOINT,
    api_key="not-needed"
)       

@app.get("/")   
def hello():
    return {"message": "Hello World!"}

@app.websocket("/chat")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        while True:
            data = await websocket.receive_text()
            print(f"Received data: {data}")
            try:
                response = await client.chat.completions.create(
                    top_p=0.9,
                    temperature=0.9,
                    model=MODEL,
                    messages=[{"role": "user", "content": data}],
                    stream=True
                )
                await websocket.send_json({"status": "start_streaming", "message_status": "success", "data": data})

                async for chunk in response:
                    if chunk.choices[0].delta.content:
                        print(chunk.choices[0].delta.content)
                        chat_bot_data = chunk.choices[0].delta.content
                        await websocket.send_json({"status": "streaming", "message_status": "success", "data": chat_bot_data})
            except RequestError as e:
                print(f"Connection error: {e}")
                error_message ="Error: Unable to connect to the server."
                await websocket.send_json({"status": "error", "message_status": "error", "data": error_message})
                break
            except Exception as e:
                print(f"Unexpected error: {e}")
                error_message = "Error: An unexpected error occurred. ===> Error: Unable to process your request."
                await websocket.send_json({"status": "error", "message_status": "error", "data": error_message})
                break
            await websocket.send_json({"status": "end_streaming", "message_status": "success", "data": "End of stream."})
    except Exception as e:
        await websocket.send_json({"status": "error", "message_status": "error", "data": "Error: WebSocket connection closed."})
        print(f"Error during WebSocket communication: {e}")
    finally:
        await websocket.close()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    print('a new websocket to create.')
    await websocket.accept()
    while True:
        try:
            data = await websocket.receive_text()
            print(f"Received data: {data}")
            # Send message to the client
            resp = {'value': random.uniform(0, 1)}
            await websocket.send_json(resp)
        except Exception as e:
            print('error:', e)
            break
    print('Bye..')