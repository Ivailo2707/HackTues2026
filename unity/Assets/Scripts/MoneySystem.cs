using TMPro;
using UnityEngine;

public class MoneySystem : MonoBehaviour
{
    [Header("Settings")] 
    public static int money = 10;
    
    [Header("UI")]
    public TextMeshProUGUI moneyText;

    public static void addMoney(int amount)
    {
        money += amount;
    }
    
    public static void subtractMoney(int amount)
    {
        money -= amount;
    }

    private void Update()
    {
        if(money < 0) money = 0;
        if(moneyText != null) moneyText.text = "Money: " + money;
        
    }
}
