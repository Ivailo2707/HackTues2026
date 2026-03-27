using UnityEngine;
using System.IO.Ports;

public class SerialTest : MonoBehaviour
{
    SerialPort serial = new SerialPort("COM8", 115200, Parity.None, 8, StopBits.One);

    void Start()
    {
        serial.Handshake = Handshake.None;
        serial.DtrEnable = true;
        serial.RtsEnable = true;
        serial.NewLine = "\r\n";
        serial.ReadTimeout = 50;

        try
        {
            serial.Open();
            Debug.Log("SERIAL OPENED");
        }
        catch (System.Exception e)
        {
            Debug.LogError(e.Message);
        }
    }

    void Update()
    {
        if (serial.IsOpen)
        {
            try
            {
                string data = serial.ReadExisting();

                if (!string.IsNullOrEmpty(data))
                {
                    Debug.Log("DATA: " + data);
                }
            }
            catch {}
        }
    }
}