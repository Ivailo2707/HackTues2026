using UnityEngine;
using UnityEngine.InputSystem;

public class PadDebug : MonoBehaviour
{
    void Update()
    {
        if (Gamepad.current != null)
        {
            Debug.Log("Gamepad current: " + Gamepad.current.displayName);
        }

        if (Joystick.current != null)
        {
            Debug.Log("Joystick current: " + Joystick.current.displayName);
        }

        foreach (var device in InputSystem.devices)
        {
            Debug.Log(device.displayName + " | " + device.layout);
        }
    }
}