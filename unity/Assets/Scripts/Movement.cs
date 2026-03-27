using UnityEngine;
using System.IO.Ports;

public class Movement : MonoBehaviour
{
    [Header("Movement")]
    public float moveSpeed = 5f;

    [Header("Look")]
    public float mouseSensitivity = 2f;
    public float serialLookSensitivity = 120f;
    public Transform cameraHolder;

    [Header("Deadzone")]
    public float moveDeadzone = 0.1f;
    public float lookDeadzone = 0.1f;

    private Rigidbody rb;
    private float xRotation = 0f;

    private float moveInputX;
    private float moveInputZ;

    private float serialMoveX;
    private float serialMoveZ;
    private float serialLookX;
    private float serialLookY;

    private float lookCenterX;
    private float lookCenterY;
    private bool calibrated = false;

    SerialPort serial = new SerialPort("COM8", 115200, Parity.None, 8, StopBits.One);

    void Start()
    {
        rb = GetComponent<Rigidbody>();
        rb.freezeRotation = true;

        Cursor.lockState = CursorLockMode.Locked;
        Cursor.visible = false;

        serial.Handshake = Handshake.None;
        serial.DtrEnable = true;
        serial.RtsEnable = true;
        serial.NewLine = "\r\n";
        serial.ReadTimeout = 50;

        try
        {
            serial.Open();
            Debug.Log("Serial opened");
        }
        catch (System.Exception e)
        {
            Debug.LogError(e.Message);
        }
    }

    void Update()
    {
        // SERIAL READ
        if (serial.IsOpen)
        {
            try
            {
                string line = serial.ReadLine();

                string[] split = line.Split(',');

                if (split.Length >= 4)
                {
                    float.TryParse(split[0], out serialMoveX);
                    float.TryParse(split[1], out serialMoveZ);
                    float.TryParse(split[2], out serialLookX);
                    float.TryParse(split[3], out serialLookY);

                    // vzimame purvite look stoinosti kato centur
                    if (!calibrated)
                    {
                        lookCenterX = serialLookX;
                        lookCenterY = serialLookY;
                        calibrated = true;
                    }
                }
            }
            catch { }
        }

        // KEYBOARD MOVE
        float kbX = 0f;
        float kbZ = 0f;

        if (Input.GetKey(KeyCode.A)) kbX -= 1f;
        if (Input.GetKey(KeyCode.D)) kbX += 1f;
        if (Input.GetKey(KeyCode.S)) kbZ -= 1f;
        if (Input.GetKey(KeyCode.W)) kbZ += 1f;

        // SERIAL MOVE DEADZONE
        float fixedMoveX = serialMoveX;
        float fixedMoveZ = serialMoveZ;

        moveInputX = Mathf.Clamp(kbX - fixedMoveZ, -1f, 1f);
        moveInputZ = Mathf.Clamp(kbZ + fixedMoveX, -1f, 1f);

        // COMBINE MOVE
        moveInputX = Mathf.Clamp(kbX + fixedMoveX, -1f, 1f);
        moveInputZ = Mathf.Clamp(kbZ + fixedMoveZ, -1f, 1f);

        // MOUSE LOOK
        float mouseX = Input.GetAxis("Mouse X") * mouseSensitivity;
        float mouseY = Input.GetAxis("Mouse Y") * mouseSensitivity;

        // SERIAL LOOK CENTER + DEADZONE
        float fixedLookX = serialLookX - lookCenterX;
        float fixedLookY = serialLookY - lookCenterY;

        if (Mathf.Abs(fixedLookX) < lookDeadzone) fixedLookX = 0f;
        if (Mathf.Abs(fixedLookY) < lookDeadzone) fixedLookY = 0f;

        // COMBINE LOOK
        float lookX = mouseX + (fixedLookX * serialLookSensitivity * Time.deltaTime);
        float lookY = mouseY + (fixedLookY * serialLookSensitivity * Time.deltaTime);

        xRotation -= lookY;
        xRotation = Mathf.Clamp(xRotation, -90f, 90f);

        cameraHolder.localRotation = Quaternion.Euler(xRotation, 0f, 0f);
        transform.Rotate(Vector3.up * lookX);
    }

    void FixedUpdate()
    {
        Vector3 move = (transform.right * moveInputX + transform.forward * moveInputZ).normalized;

        Vector3 velocity = rb.linearVelocity;
        velocity.x = move.x * moveSpeed;
        velocity.z = move.z * moveSpeed;

        rb.linearVelocity = velocity;
    }

    void OnApplicationQuit()
    {
        if (serial.IsOpen)
            serial.Close();
    }
}