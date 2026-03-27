using UnityEngine;
using WebSocketSharp;

public class WebSocketScript : MonoBehaviour
{
    WebSocket ws;
    void Start()
    {
        InputReader.GetText();
        ws = new WebSocket(InputReader.address);
        ws.OnOpen += (sender, e) =>
        {
            Debug.Log("Opened" + e);
        };
        ws.OnError += (sender, e) =>
        {
            Debug.Log("Error" + e.Message);
        };
        ws.OnClose += (sender, e) =>
        {
            Debug.Log("Closed" + e);
        };
        ws.OnMessage += (sender, e) =>
        {
            Debug.Log(e.Data.ToString());
        };
        ws.Connect();
    }

    // Update is called once per frame
    void Update()
    {
        if (ws == null) Debug.Log("WebSocket Script is Null");
        if (Input.GetKeyDown(KeyCode.Space))
            ws.Send("Dog");
    }
}
