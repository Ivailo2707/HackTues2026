using TMPro;
using UnityEngine;

public class WaterSystem : MonoBehaviour
{
    [Header("Settings")] 
    public static int water = 3;
    
    [Header("UI")]
    public TextMeshProUGUI waterText;

    public static void addWater(int amount)
    {
        water += amount;
    }
    
    public static void useWater(int amount)
    {
        water -= amount;
    }

    private void Update()
    {
        if(waterText != null) waterText.text = "Water: " + water;
    }
}
