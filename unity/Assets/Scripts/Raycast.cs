using System;
using UnityEngine;

public class Raycast : MonoBehaviour
{
    [Header("Raycast Settings")]
    public float raycastDistance;
    public GameObject playerCam;
    public LayerMask interactableLayer;
    public LayerMask pickableLayer;

    [Header("References")]
    private GrowCrop growCrop;
    private CollectCrops collectCrops;
    private Outline outline;

    [Header("Keybinds")]
    public KeyCode keybind = KeyCode.E;

    void Update()
    {
        RaycastHit hit;
        
        // growing plants
        if (Physics.Raycast(playerCam.transform.position, playerCam.transform.forward, out hit, raycastDistance, interactableLayer))
        {
            outline = hit.transform.GetComponent<Outline>();
            if(outline != null)
                outline.enabled = true;
            ParticleSystem ps = hit.transform.GetComponentInChildren<ParticleSystem>();
            if(Input.GetKeyDown(keybind))
            {
                growCrop = hit.transform.GetComponent<GrowCrop>();
                collectCrops = hit.transform.GetComponent<CollectCrops>();
                if (growCrop.isCropYoung && !growCrop.isCropCollected)
                {
                    if (WaterSystem.water > 0)
                    {
                        WaterSystem.useWater(1);
                    }
                    else if (MoneySystem.money >= 5)
                    {
                        MoneySystem.subtractMoney(5);
                    }
                    else
                    {
                        return;
                    }

                    ps.Play(true);
                    growCrop.ChangeCrops();
                    collectCrops.isCropReady = true;
                }
            }
            // collecting plants
        } else if (Physics.Raycast(playerCam.transform.position, playerCam.transform.forward, out hit, raycastDistance, pickableLayer))

        {
            outline = hit.transform.GetComponent<Outline>();
            outline.enabled = true;
            if(Input.GetKeyDown(keybind))
            {
                collectCrops = hit.transform.GetComponent<CollectCrops>();
                collectCrops.Collect();
            }
        }
        else
        {
            if(outline != null)
                outline.enabled = false;
        } 
            
    }
}
