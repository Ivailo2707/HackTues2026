using UnityEngine;

public class SwapPlayers : MonoBehaviour
{
    [Header("Settings")]
    public bool isItDrone = false;
    public GameObject Drone;
    public GameObject Player;
    
    void Update()
    {
        if(Input.GetMouseButtonDown(0)) isItDrone = false;
        if(Input.GetMouseButtonDown(1)) isItDrone = true;
        
        if (isItDrone)
        {
            if(Drone != null) Drone.SetActive(true);
            if(Player != null) Player.SetActive(false);
        }
        else
        {
            if(Drone != null) Drone.SetActive(false);
            if(Player != null) Player.SetActive(true);
        }
    }
}
