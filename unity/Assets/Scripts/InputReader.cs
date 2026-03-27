using System;
using TMPro;
using UnityEngine;

public class InputReader : MonoBehaviour
{
    public static TMP_InputField inputField;
    public static string address = "Empty";

    private void Start()
    {
        inputField = GetComponentInChildren<TMP_InputField>();
    }

    public static void GetText()
    {
        address = inputField.text;
        Debug.Log("Text: " + address);
    }
}